---
title: "I implemented End-to-End Encryption"
author: "Nykenik"
date: 2026-07-07T19:33:01+02:00
summary: "and it was very fun!"
tags: ["Project", "Code", "Lang-golang"]
draft: false
---

Right now I am working on a simple chat app, and I recently implemented this nice E2EE[^1] API which I will use to encrypt all messages and make the chat app more secure. Well, that when I have basic authorization.

So, let's analyze it together, shall we?

> NOTE: all comments you see aren't in the source code, but I added them
> for this article!

---

## Keypairs

The first step in E2EE is to generate two keys, one public and one private. The public key will be shared between clients, while the private one will remain of strict per-client use (that's why it is called a __private__ key!)
```go
type Keypair struct {
	Private *ecdh.PrivateKey
	Public  *ecdh.PublicKey
}

func GenKeypair() (*Keypair, error) {
  // elliptic-curve
	curve := ecdh.X25519()

  // rand.Reader is an io.Reader instance present in standard
  // crypto/rand package that allows for the generation of fixed-size
  // cryptographically secure pseudo-random chains of bytes.
  //
  // ecdh.X25519().curve.GenerateKey always reads exactly 32 bytes.
	priv, err := curve.GenerateKey(rand.Reader)
	if err != nil {
		return nil, err
	}

	pub := priv.PublicKey()

	return &Keypair{priv, pub}, nil
}
```

This means that for Bob and Alice to generate their keys, they need to run:
```go
keys, err := crypto.GenKeypair()
```

To generate these keys I use `Curve25519`[^2] specifically, which I am using for DH[^3]. If this seems like gibberish to you, you are probably not ready for what's coming next, so go read the footnotes.

---

## Shared secret

After generating the keypairs the next step of DH[^3] is agreeing on a shared secret, which is very straightforward in my API:
```go
// simple helper to convert a variable-size slice into a fixed-size Key, which
// is an alias for [keyLen]byte, and keyLen is equal to 32. Meaning all keys must
// be 32 bytes. I panic if the key isn't keyLen bytes long as this case is basically
// impossible unless I make an error in-code
func keyFromSlice(s []byte) Key {
	if len(s) != keyLen {
		panic(fmt.Sprintf("key slice must be %d bytes long exactly, it is %d bytes long", keyLen, len(s)))
	}

	var sCopy [keyLen]byte
	copy(sCopy[:], s)
	return sCopy
}

func (k *Keypair) Agree(othersPub *ecdh.PublicKey) (shared Key, err error) {
	rawShared, err := k.Private.ECDH(othersPub)
	if err != nil {
		return
	}
	shared = keyFromSlice(rawShared)

  // in case you don't know, if the return values
  // have names in Go as long as you assign them all
  // before returning you can simply write an empty
  // return and the values will be automatically filled in.
	return
}
```

So now Alice and Bob do:
```go
sharedSecret, err := alice.Agree(bob.Public)
```
or, for Bob:
```go
sharedSecret, err := bob.Agree(alice.Public)
```
> Here `alice` and `bob` have type `*Keypair`.

If everything went well (all errors were `nil`), then Alice's secret should be the exact same as Bob's.

---

## Derivation

Now that we have the shared secret that both Alice and Bob agreed on we derive it to make nonce[^4] management easier. Derivation isn't mandatory, I just do it for convenience.

The function I use to derive the keys is HKDF[^5]:
```go
type Derived struct {
	Send    Key // the key used to encrypt sent messages
	Receive Key // the key used to decrypt received messages
}

type DeriveRole uint8

const (
	RoleInitiator DeriveRole = iota // first handshaker
	RoleResponder
)

func Derive(sharedSecret Key, role DeriveRole) (*Derived, error) {
  // uses sha256 to generate the HMAC hash for derivation
	reader := hkdf.New(sha256.New, sharedSecret[:], nil, []byte(hkdfInfo))

  // 32 * 2 = 64
  // meaning the derived key will always be
  // 64 bytes long
	key := make([]byte, keyLen*2)
	_, err := reader.Read(key)
	if err != nil {
		return nil, err
	}

	var send, recv []byte
	switch role {
	case RoleInitiator:
    // send is first 32 bytes
    // recv is last 32 bytes
		send, recv = key[:keyLen], key[keyLen:]
	case RoleResponder:
    // send is last 32 bytes
    // recv is first 32 bytes
		send, recv = key[keyLen:], key[:keyLen]
	default:
		return nil, fmt.Errorf("unknown role %d", int(role))
	}

  // clear the key as it's no longer needed
	clear(key)

	return &Derived{keyFromSlice(send), keyFromSlice(recv)}, nil
}
```

Note that here is the first important difference in calls, and it's related to each one's roles. Supposing Alice initiates the handshake, Alice derives like this:
```go
derived, err := crypto.Derive(sharedSecret, crypto.RoleInitiator)
```
and Bob does:
```go
derived, err := crypto.Derive(sharedSecret, crypto.RoleResponder)
```

The role just serves the purpose of reversing the order in which the keys are handed out, as you can see in the implementation above. This is because if both Alice and Bob have:
```
Send = A
Receive = B
```

Then if Bob receives a message from Alice (which was encrypted with `derived.Send`, which is `A`) he will try to decrypt it with `derived.Receive` (which is `B`), which will fail even though everything else went well as the keys don't match. __The one that first makes the handshake is the initiator.__

That's why we reverse the order, so Alice has normal order, as she's the initiator:
```
Send = A
Receive = B
```
and Bob has reverse order, as he's the responder:
```
Send = B
Receive A
```

Now Alice uses `A` to encrypt, `B` to decrypt and Bob uses `B` to encrypt, `A` to decrypt.

---

## Sessions

Keys were generated, shared secret was computed and derived, and now we just need to create the actual session which our fellow chatters Alice and Bob will use to talk securely and don't get spied by the creator of the server or a government organization.

Sessions are the longest chunk, as they contain two parts:
1. Session creation.
2. Encryption/decryption of messages.

### Session creation

Session creation is pretty straightforward:
```go
type Session struct {
	sendAEAD cipher.AEAD
	recvAEAD cipher.AEAD

	sendCounter uint64
	recvCounter uint64
}

func NewSession(keys Derived) (*Session, error) {
	sess := &Session{
		sendCounter: 0,
		recvCounter: 0,
	}

	sendAEAD, err := chacha20poly1305.New(keys.Send[:])
	if err != nil {
		return nil, err
	}
	sess.sendAEAD = sendAEAD

	recvAEAD, err := chacha20poly1305.New(keys.Receive[:])
	if err != nil {
		return nil, err
	}
	sess.recvAEAD = recvAEAD

	return sess, nil
}
```

Here we can see two main initializations:
- The counters to 0.
- The AEADs[^6].

Here I use ChaCha20-Poly1305[^7], as it's a pretty fast and efficient encryption/decryption algorithm that also allows me to add Additional Authenticated Data (AAD), which is data that isn't encrypted but it is authenticated so it adds an extra layer of protection, as attackers can totally see the AAD but can't change it because it's "protected".

The reason I cache the ChaCha20-Poly1305 instances is pretty simple: why generate them every time?

### Encryption

Encryption is very straightforward:
1. Generate the nonce (just put the send counter into a 12-byte [96-bit] buffer).
2. Cipher the text (no salt for now).
3. Return the counter and ciphered text.

```go
func (s *Session) Encrypt(plaintext []byte, aad []byte) (uint64, []byte, error) {
	var nonce Nonce
  // puts the counter into the first 4 bytes of
  // the 96-bit nonce buffer
	binary.BigEndian.PutUint64(nonce[4:], s.sendCounter)

  // store the counter as we can't pass the increased counter.
  //
  // passing s.sendCounter after incrementing it
  // would break ALL the system
	counter := s.sendCounter

	ciphertext := s.sendAEAD.Seal(
		nil,
		nonce[:],
		plaintext,
		aad,
	)

	s.sendCounter++

	return counter, ciphertext, nil
}
```

So to encrypt a message:
```go
counter, ciphertext, err := session.Encrypt(
  []byte("the quick lazy dog jumps over the brown fox"),
  nil, // no AAD
)
```

### Decryption

Decryption is also ultra simple, although it has one more step:
1. Put the provided counter into a nonce (same `uint64` into a `[12]byte` buffer process).
2. Check if the counter provided is the same as the receive counter of the session. If it's not, return an error, as it's probably a replay attack or something else.
3. Decipher the text. If it fails, then return the error.
4. Return the deciphered text.

```go
func (s *Session) Decrypt(counter uint64, ciphertext []byte, aad []byte) ([]byte, error) {
	var nonce Nonce
	binary.BigEndian.PutUint64(nonce[4:], counter)

	if counter != s.recvCounter {
		return nil, fmt.Errorf("unexpected message counter")
	}

	plaintext, err := s.recvAEAD.Open(
		nil,
		nonce[:],
		ciphertext,
		aad,
	)

	if err != nil {
		return nil, err
	}

	s.recvCounter++

	return plaintext, nil
}
```

So to decrypt a message:
```go
plaintext, err := session.Decrypt(
  counter,
  ciphertext,
  nil,
)
```

## Conclusion

This API is very nice, easy to use, and the full file is only a whooping 169 lines, so few for something so complicated! Go is incredible indeed.

Also, this system allows me to easily add more people and makes whispers (messages from a person to another that can't be read by others) very easy to implement.

By the way, the total number of sessions per-room will always be:
```
n(n-1)/2
```
Where `n` is the total number of peers.

So, overall, this system is very nice!!!

[^1]: [End-to-End Encryption](https://en.wikipedia.org/wiki/End-to-end_encryption) is a method of implementing a secure communication system where only the sender and intended recipient can read the messages.
[^2]: [Curve25519](https://en.wikipedia.org/wiki/Curve25519) is an [elliptic curve](https://en.wikipedia.org/wiki/Elliptic_curve) used in [elliptic-curve cryptography](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography) (ECC) offering 128 [bits of security](https://en.wikipedia.org/wiki/Bits_of_security) (256-bit key size) and designed for use with the [Elliptic-curve Diffie–Hellman](https://en.wikipedia.org/wiki/Elliptic-curve_Diffie%E2%80%93Hellman) (ECDH) key agreement scheme.
[^3]: [Diffie-Hellman (DH) Key Exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) is a mathematical method of securely generating a symmetric cryptographic key over a public channel.
[^4]: A [nonce](https://en.wikipedia.org/wiki/Cryptographic_nonce) is an arbitrary number that __can be used just once__. In my case nonces are actually a sequence rather than pseudo-random numbers.
[^5]: [HKDF](https://en.wikipedia.org/wiki/HKDF) is a multi-purpose [key derivation function](https://en.wikipedia.org/wiki/Key_derivation_function) (KDF) based on the [HMAC](https://en.wikipedia.org/wiki/HMAC) [message authentication code](https://en.wikipedia.org/wiki/Message_authentication_code).
[^6]: [Authenticated encryption with associated data](https://en.wikipedia.org/wiki/Authenticated_encryption#Authenticated_encryption_with_associated_data) (AEAD) is a variant of [AE](https://en.wikipedia.org/wiki/Authenticated_encryption) that allows messages to include "associated data" (AD, additional non-confidential information, a.k.a "additional authenticated data", AAD).
[^7]: [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) is an AEAD[^6] algorithm, that combines the [ChaCha20](https://en.wikipedia.org/wiki/Salsa20#ChaCha_variant) stream cipher with the [Poly1305](https://en.wikipedia.org/wiki/Poly1305) message authentication code.
