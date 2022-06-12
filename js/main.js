// $(".btn-detalhes").click(function () {
//   $(".area-detalhes").toggleClass("hidden");
//   if ($(this).find("span").text() === "Ocultar detalhes") {
//     $(this).find("span").text("Mostrar detalhes");
//   } else {
//     $(this).find("span").text("Ocultar detalhes");
//   }
// });

$(".botao-passos").css("display", "none");
$(".botao-testar").css("display", "none");

$(".botao-gerar").click(function () {
  setTimeout(function () {
    toggleBotoes();
  }, 200);
});
$(".token").on("input", function () {
  toggleBotoes();
});

function toggleBotoes() {
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
    $tabela.append(trSintatico());
    $(".tr-sintatico").append(tdPilha("$S"));
    $(".tr-sintatico").append(tdEntrada($(".token").val() + "$"));
    var cedula = $(".tabela-automato")
      .find(".linha-S")
      .find(".coluna-" + $(".token").val().split("")[0])
      .text();
    $(".tr-sintatico").append(tdAcao(cedula));
  } else if ($(".td-acao").last().text().split(" ")[0] === "Lê") {
    desempila();
  } else {
    empilha();
  }
  $(".botao-testar").css("display", "none");
  $(".botao-gerar").css("display", "none");
  $("html").prop("scrollTop", $("html").prop("scrollHeight"));
});

$(".botao-testar").click(function () {
  $tabela.append(trSintatico());
  $(".tr-sintatico").append(tdPilha("$S"));
  $(".tr-sintatico").append(tdEntrada($(".token").val() + "$"));
  var cedula = $(".tabela-automato")
    .find(".linha-S")
    .find(".coluna-" + $(".token").val().split("")[0])
    .text();
  $(".tr-sintatico").append(tdAcao(cedula));
  $(".botao-reiniciar").css("display", "");
  $(".botao-passos").css("display", "none");
  $(".botao-testar").css("display", "none");
  $(".botao-gerar").css("display", "none");

  while (
    $(".td-acao").last().text().split(" ")[0] != "Erro" ||
    $(".td-acao").last().text().split(" ")[0] != "OK"
  ) {
    if ($(".td-acao").last().text().split(" ")[0] === "Lê") {
      desempila();
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
    $tabela.append(trSintatico());
    $(".tr-sintatico")
      .last()
      .append(tdPilha(texto_pilha.substr(0, texto_pilha.length - 1)));
    $(".tr-sintatico")
      .last()
      .append(tdEntrada($(".td-entrada").last().text()));
  } else {
    $tabela.append(trSintatico());
    $(".tr-sintatico")
      .last()
      .append(
        tdPilha(texto_pilha.substr(0, texto_pilha.length - 1) + ultima_seq)
      );
    $(".tr-sintatico")
      .last()
      .append(tdEntrada($(".td-entrada").last().text()));
  }

  var texto_entrada = $(".td-entrada").last().text();
  cedulaComparavel(
    $(".td-pilha").last().text().split("").pop(),
    texto_entrada.split("")[0]
  );
}

function cedulaComparavel(linha, coluna) {
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
        tdAcao(
          "OK em " + $(".tbody-sintatico").find("tr").length + " iterações"
        )
      );
  } else if (coluna === linha) {
    var ultima_letra_pilha = $(".td-pilha").last().text().split("").pop();
    var primeira_letra_entrada = $(".td-entrada").last().text().split("")[0];

    $(".tr-sintatico")
      .last()
      .append(tdAcao("Lê " + ultima_letra_pilha + " e desempilha"));
  } else {
    var cedula = $(".tabela-automato")
      .find(".linha-" + linha)
      .find(".coluna-" + coluna)
      .text();
    if (cedula != "") {
      return $(".tr-sintatico").last().append(tdAcao(cedula));
    } else {
      $(".botao-reiniciar").css("display", "");
      $(".botao-passos").css("display", "none");
      $(".tokens-incorretos").val(
        $(".tokens-incorretos").val() + " " + $(".token").val()
      );
      return $(".tr-sintatico")
        .last()
        .append(
          tdAcao(
            "Erro em " + $(".tbody-sintatico").find("tr").length + " iterações"
          )
        );
    }
  }
}

function desempila() {
  var texto_pilha = $(".td-pilha").last().text();
  $tabela.append(trSintatico());
  $(".tr-sintatico")
    .last()
    .append(tdPilha(texto_pilha.substr(0, texto_pilha.length - 1)));
  $(".tr-sintatico")
    .last()
    .append(tdEntrada($(".td-entrada").last().text().substr(1)));

  var texto_entrada = $(".td-entrada").last().text();
  cedulaComparavel(
    $(".td-pilha").last().text().split("").pop(),
    texto_entrada.split("")[0]
  );
}

function tdPilha(elemento) {
  return "<td class='td-pilha'>" + elemento + "</td>";
}

function tdEntrada(elemento) {
  return "<td class='td-entrada'>" + elemento + "</td>";
}

function tdAcao(elemento) {
  return "<td class='td-acao'>" + elemento + "</td>";
}

function trSintatico() {
  return "<tr class='tr-sintatico'></tr>";
}

$(".botao-gerar").click(function () {
  tamanho = 20000;
  var token = gerarTokens("");
  token = token.split("");
  while (true) {
    token = gerarTokens(token.join("")).split("");
    var errado = false;
    token.forEach(function (e) {
      if (e === e.toUpperCase()) {
        errado = true;
      }
    });
    if (errado) {
      gerarTokens(token.join(""));
    } else {
      token = token.join("");
      $(".token").val(token);
      return token;
      break;
    }
  }
});

function objetos(letra) {
  if (letra === "s") {
    return ["aAc", "bC"];
  }
  if (letra === "a") {
    return ["cB"];
  }
  if (letra === "b") {
    return ["&", "bCa"];
  }
  if (letra === "c") {
    return ["aBa", "b"];
  }
}

function gerarTokens(token) {
  if (token === "") {
    token = objetos("s")[Math.floor(Math.random() * objetos("s").length)];
  } else {
    token = token;
  }
  token = token.split("");
  var novo_token = [];
  token.forEach(function (e) {
    if (e === e.toUpperCase()) {
      var letra = objetos(e.toLowerCase());
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
