const type_keywords = "byte int16 int32 int64 ubyte uint16 uint32 uint64 float32 float64 boolean string void fallible typename";

hljs.registerLanguage("sable", function(hljs) {
  return {
    name: "Sable",
    aliases: ["sable"],

    keywords: {
      keyword:
        `if else while for return break continue struct enum fn method let const export infer throw try defer switch case error union type static data typeargs`,
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
        className: "function",
        begin: /[a-zA-Z_]\w*(?=\s*\()/,
      },

      {
        className: "property",
        begin: /(?<=::)[a-zA-Z_]\w*/,
      },

      {
        className: "built_in",
        begin: /#file|(?:@[a-zA-Z_]\w*(?=\s*\())/,
      },

      {
        className: "title.class",
        begin: /[a-zA-Z_]\w*(?=::)/,
      },

      {
        className: "operator",
        match: /([+-/*=><{}()[\]#,.]|==|!=|<=|>=|\b(or|and)\b|::|(?<!\w)_(?!\w))/,
      },

      {
        className: "meta",
        begin: /(?<=#{)[a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*(?=})/,
      },

      {
        className: "meta",
        keywords: {
          type: type_keywords,
        },
        match: /(?<=<)\s*[a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*\s*(?=>)/,
      },

      {
        className: "meta",
        match: /(?<=#file\.)[a-zA-Z_]\w*/,
      },
    ],
  };
});
