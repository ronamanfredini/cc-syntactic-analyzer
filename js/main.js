$(".botao-passos").css("display", "none");
$(".botao-gerar").click(function () {
  setTimeout(function () {
    toggleButtons();
  }, 200);
});
$(".token").on("input", function () {
  toggleButtons();
});

function toggleButtons() {
  if ($(".token").val() != "") {
    $(".botao-passos").css("display", "");
    $(".botao-testar").css("display", "");
  } else {
    $(".botao-passos").css("display", "none");
    $(".botao-testar").css("display", "none");
  }
}

var click = 0;
var $tabela = $(".tbody-sintatico");

$(".botao-passos").click(function () {
  click += 1;
  if (click <= 1) {
    $tabela.append(syntatic());
    $(".tr-sintatico").append(stack("$S"));
    $(".tr-sintatico").append(entry($(".token").val() + "$"));
    var cedula = $(".tabela-automato")
      .find(".linha-S")
      .find(".coluna-" + $(".token").val().split("")[0])
      .text();
    $(".tr-sintatico").append(action(cedula));
  } else if ($(".td-acao").last().text().split(" ")[0] === "Lê") {
    popFromStack();
  } else {
    empilha();
  }
  $(".botao-testar").css("display", "none");
  $(".botao-gerar").css("display", "none");
  $("html").prop("scrollTop", $("html").prop("scrollHeight"));
});

$(".botao-testar").click(function () {
  $tabela.append(syntatic());
  $(".tr-sintatico").append(stack("$S"));
  $(".tr-sintatico").append(entry($(".token").val() + "$"));
  var cedula = $(".tabela-automato")
    .find(".linha-S")
    .find(".coluna-" + $(".token").val().split("")[0])
    .text();
  $(".tr-sintatico").append(action(cedula));
  $(".botao-reiniciar").css("display", "");
  $(".botao-passos").css("display", "none");
  $(".botao-testar").css("display", "none");
  $(".botao-gerar").css("display", "none");

  while (
    $(".td-acao").last().text().split(" ")[0] != "Erro" ||
    $(".td-acao").last().text().split(" ")[0] != "OK"
  ) {
    if ($(".td-acao").last().text().split(" ")[0] === "Lê") {
      popFromStack();
    } else {
      empilha();
    }
    $("html").prop("scrollTop", $("html").prop("scrollHeight"));
  }
});

function empilha() {
  var ultima_seq = $(".td-acao")
    .last()
    .text()
    .split("> ")[1]
    .split("")
    .reverse()
    .join("");
  var texto_pilha = $(".td-pilha").last().text();

  if ($(".td-acao").last().text().split("> ")[1] === "&") {
    $tabela.append(syntatic());
    $(".tr-sintatico")
      .last()
      .append(stack(texto_pilha.substr(0, texto_pilha.length - 1)));
    $(".tr-sintatico")
      .last()
      .append(entry($(".td-entrada").last().text()));
  } else {
    $tabela.append(syntatic());
    $(".tr-sintatico")
      .last()
      .append(
        stack(texto_pilha.substr(0, texto_pilha.length - 1) + ultima_seq)
      );
    $(".tr-sintatico")
      .last()
      .append(entry($(".td-entrada").last().text()));
  }

  var texto_entrada = $(".td-entrada").last().text();
  compare(
    $(".td-pilha").last().text().split("").pop(),
    texto_entrada.split("")[0]
  );
}

function compare(linha, coluna) {
  if (coluna == "$") {
    coluna = "s";
  }
  if (linha == "$") {
    linha = "k";
  }
  if (linha === "k" && coluna === "s") {
    $(".botao-reiniciar").css("display", "");
    $(".botao-passos").css("display", "none");
    $(".tokens-corretos").val(
      $(".tokens-corretos").val() + " " + $(".token").val()
    );
    return $(".tr-sintatico")
      .last()
      .append(
        action(
          "OK em " + $(".tbody-sintatico").find("tr").length + " iterações"
        )
      );
  } else if (coluna === linha) {
    var ultima_letra_pilha = $(".td-pilha").last().text().split("").pop();
    var primeira_letra_entrada = $(".td-entrada").last().text().split("")[0];

    $(".tr-sintatico")
      .last()
      .append(action("Lê " + ultima_letra_pilha));
  } else {
    var cedula = $(".tabela-automato")
      .find(".linha-" + linha)
      .find(".coluna-" + coluna)
      .text();
    if (cedula != "") {
      return $(".tr-sintatico").last().append(action(cedula));
    } else {
      $(".botao-reiniciar").css("display", "");
      $(".botao-passos").css("display", "none");
      $(".tokens-incorretos").val(
        $(".tokens-incorretos").val() + " " + $(".token").val()
      );
      return $(".tr-sintatico")
        .last()
        .append(
          action(
            "Erro em " + $(".tbody-sintatico").find("tr").length + " iterações"
          )
        );
    }
  }
}

function popFromStack() {
  var texto_pilha = $(".td-pilha").last().text();
  $tabela.append(syntatic());
  $(".tr-sintatico")
    .last()
    .append(stack(texto_pilha.substr(0, texto_pilha.length - 1)));
  $(".tr-sintatico")
    .last()
    .append(entry($(".td-entrada").last().text().substr(1)));

  var texto_entrada = $(".td-entrada").last().text();
  compare(
    $(".td-pilha").last().text().split("").pop(),
    texto_entrada.split("")[0]
  );
}

const stack = element => `<td class='td-pilha'>${element}</td>`;
const entry = element => `<td class='td-entrada'>${element}</td>`;
const action = (element) =>`<td class='td-acao'>${element}</td>`;
const syntatic = () => `<tr class='tr-sintatico'></tr>`;

const alreadyGeneratedTokens = {};

const generateRandomAcceptableString = () => {
  const maxSize = 20;
  let token = generateTokens("");
  token = token.split("");
  while (true) {
    token = generateTokens(token.join("")).split("");
    let isWrong = false;
    token.forEach(function (e) {
      if (e === e.toUpperCase()) {
        isWrong = true;
      }
    });
    if (isWrong) {
      if (token.length > maxSize) {
        return generateRandomAcceptableString();
      }

      generateTokens(token.join(""));
    } else {
      token = token.join("");

      if (!alreadyGeneratedTokens[token]) {
        $(".token").val(token);
        alreadyGeneratedTokens[token] = true;
        return token;
        break;
      }

      return generateRandomAcceptableString();
    }
  }
}

$(".botao-gerar").click(function () {
  generateRandomAcceptableString()
});

function pathMapping(path) {
  const mapping = {
    s: ["aBc", "bABC"],
    a: ["CA", 'bA'],
    b: ['dC', '&'],
    c:  ["aB", "cCb"]
  };

  return mapping[path];
}

function generateTokens(token) {
  if (token === "") {
    token = pathMapping("s")[Math.floor(Math.random() * pathMapping("s").length)];
  } else {
    token = token;
  }
  token = token.split("");
  var novo_token = [];
  token.forEach(function (e) {
    if (e === e.toUpperCase()) {
      var letra = pathMapping(e.toLowerCase());
      e = letra[Math.floor(Math.random() * letra.length)];
    }
    if (e != "&") {
      novo_token.push(e);
      token = novo_token.join("");
    }
  });
  return token;
}

$(".botao-reiniciar").click(function () {
  $(".token").val("");
  $(".tbody-sintatico").html("");
  $(".botao-gerar").css("display", "");
  $(".botao-reiniciar").css("display", "none");
  click = 0;
});


function reload() {
  document.location.reload();
}