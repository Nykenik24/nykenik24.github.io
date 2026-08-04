const type_keywords = "byte int16 int32 int64 ubyte uint16 uint32 uint64 float32 float64 boolean string void fallible typename";

hljs.registerLanguage("sable", function(hljs) {
  return {
    name: "Sable",
    aliases: ["sable"],

    keywords: {
      keyword:
        `if else while for return break continue struct enum fn hidden let const export infer throw try catch must defer switch case error union type static struct repeat`,
      type:
        type_keywords,
      literal:
        "true false null undefined",
    },

    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.APOS_STRING_MODE,
      hljs.C_NUMBER_MODE,

      {
        className: "type",
        match: /[a-zA-Z_]\w*(?=\*)/,
      },

      {
        className: "type",
        match: /(?<=let|const|type)\s*[a-zA-Z_]\w*/,
      },

      {
        className: "type",
        match: /(?<=[a-zA-Z_]\w*!)[a-zA-Z_]\w*/,
      },

      {
        className: "function",
        begin: /[a-zA-Z_]\w*(?=\s*\()/,
      },

      {
        className: "property",
        begin: /(?<=::)[a-zA-Z_]\w*/,
      },

      {
        className: "built_in",
        begin: /#[a-zA-Z_]\w*|(?:@[a-zA-Z_]\w*(?=\s*\())/,
      },

      {
        className: "title.class",
        begin: /[a-zA-Z_]\w*(?=::)/,
      },

      {
        className: "operator",
        match: /([+-/*=><{}()[\]#,.!]|==|!=|<=|>=|\b(or|and)\b|::|(?<!\w)_(?!\w))/,
      },

      {
        className: "meta",
        begin: /(?<=#{)[a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*(?=})/,
      },

      // {
      //   className: "meta",
      //   keywords: {
      //     type: type_keywords,
      //   },
      //   match: /(?<=<)\s*[a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*\s*(?=>)/,
      // },

      {
        className: "meta",
        match: /(?<=#[a-zA-Z_]\w*\.)[a-zA-Z_]\w*/,
      },
    ],
  };
});
