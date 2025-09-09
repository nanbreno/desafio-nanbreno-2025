/**
 * Classe que simula um abrigo de animais e decide quem adota cada um
 * com base em preferências de brinquedos das pessoas e regras do abrigo.
 */
class AbrigoAnimais {
  constructor() {
    // "catálogo" de animais disponíveis no abrigo:
    // chave = nome do animal; valor = { tipo, brinquedos favoritos }
    this.catalogo = {
      'Rex':   { tipo: 'cão',    brinquedos: ['RATO', 'BOLA'] },
      'Mimi':  { tipo: 'gato',   brinquedos: ['BOLA', 'LASER'] },
      'Fofo':  { tipo: 'gato',   brinquedos: ['BOLA', 'RATO', 'LASER'] },
      'Zero':  { tipo: 'gato',   brinquedos: ['RATO', 'BOLA'] },
      'Bola':  { tipo: 'cão',    brinquedos: ['CAIXA', 'NOVELO'] },
      'Bebe':  { tipo: 'cão',    brinquedos: ['LASER', 'RATO', 'BOLA'] },
      'Loco':  { tipo: 'jabuti', brinquedos: ['SKATE', 'RATO'] }
    };

    // Lista branca de brinquedos aceitos (evita itens desconhecidos/errados).
    this.brinquedosValidos = new Set([
      'RATO', 'BOLA', 'LASER', 'CAIXA', 'NOVELO', 'SKATE',
    ]);
  }

  /**
   * Ponto de entrada para calcular as adoções.
   *
   * Recebe três listas em formato de string separada por vírgulas:
   *  - pessoa1Str: lista de brinquedos da pessoa 1 (ex: "BOLA, RATO")
   *  - pessoa2Str: lista de brinquedos da pessoa 2
   *  - ordemAnimaisStr: ordem dos nomes dos animais a serem avaliados
   *
   * Regras principais (aplicadas no processamento):
   *  - Se as duas pessoas servem para o mesmo animal: o animal fica no abrigo.
   *  - Cada pessoa pode adotar no máximo 3 animais.
   *  - Cada pessoa pode ter no máximo 1 gato.
   *  - O animal "Loco" (jabuti) tem regras extras: a pessoa precisa
   *    ter TODOS os brinquedos que ele gosta e já possuir companhia (>= 2 animais).
   *
   * @param {string} pessoa1Str 
   * @param {string} pessoa2Str 
   * @param {string} ordemAnimaisStr 
   * @returns {{lista: string[]} | {erro: string}}
   *          Em caso de sucesso: { lista: ["Nome - destino", ...] }
   *          Em caso de erro de validação: { erro: "Brinquedo inválido" | "Animal inválido" }
   */
  encontraPessoas(pessoa1Str, pessoa2Str, ordemAnimaisStr) {
    try {
      // Converte as strings de entrada em arrays limpos.
      const pessoa1Toys = this.#parseLista(pessoa1Str);
      const pessoa2Toys = this.#parseLista(pessoa2Str);
      const ordemAnimais = this.#parseLista(ordemAnimaisStr);

      // Valida conteúdo das listas de brinquedos (duplicados e itens inválidos).
      this.#validaBrinquedos(pessoa1Toys);
      this.#validaBrinquedos(pessoa2Toys);

      // Valida nomes de animais e duplicidades na ordem.
      this.#validaAnimais(ordemAnimais);

      // Processa as adoções propriamente ditas.
      const adocoes = this.#processaAdocoes(
        pessoa1Toys,
        pessoa2Toys,
        ordemAnimais
      );

      // Organiza a saída como "Nome - destino", em ordem alfabética.
      const lista = Object.keys(adocoes)
        .sort((a, b) => a.localeCompare(b))
        .map((nome) => `${nome} - ${adocoes[nome]}`);

      return { lista };
    } catch (e) {
      // Normaliza mensagens de erro conforme solicitado pela interface.
      if (e && (e.message === 'Animal inválido' || e.message === 'Brinquedo inválido')) {
        return { erro: e.message };
      }
      // Qualquer outro erro é tratado como brinquedo inválido.
      return { erro: 'Brinquedo inválido' };
    }
  }

  /**
   * Função utilitária: converte uma string "A, B, C"
   * em um array ["A", "B", "C"] limpo (sem espaços e vazios).
   * Caso venha algo que não seja string ou vazio, retorna [].
   * @param {string} str
   * @returns {string[]}
   */
  #parseLista(str) {
    if (typeof str !== 'string') return [];
    if (str.trim() === '') return [];
    return str
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  /**
   * Valida uma lista de brinquedos:
   *  - não pode haver itens repetidos
   *  - todos devem estar em this.brinquedosValidos
   * Lança erro "Brinquedo inválido" se algo estiver fora das regras.
   * @param {string[]} lista
   */
  #validaBrinquedos(lista) {
    const set = new Set();
    for (const item of lista) {
      if (set.has(item)) throw new Error('Brinquedo inválido'); // duplicado
      set.add(item);
      if (!this.brinquedosValidos.has(item)) throw new Error('Brinquedo inválido'); // desconhecido
    }
  }

  /**
   * Valida uma lista de nomes de animais:
   *  - não pode haver nomes repetidos
   *  - todos precisam existir no catálogo
   * Lança erro "Animal inválido" se falhar.
   * @param {string[]} lista
   */
  #validaAnimais(lista) {
    const set = new Set();
    for (const nome of lista) {
      if (set.has(nome)) throw new Error('Animal inválido'); // duplicado
      set.add(nome);
      if (!this.catalogo[nome]) throw new Error('Animal inválido'); // inexistente
    }
  }

  /**
   * Núcleo da decisão de adoção.
   *
   * Para cada animal na ordem dada:
   *  1) Verifica se a pessoa 1 e/ou a pessoa 2 são elegíveis a ele.
   *  2) Se ambos são elegíveis, o animal fica no abrigo (empate).
   *  3) Se apenas um é elegível, aplica regras de limite (máx. 3 animais, máx. 1 gato).
   *  4) Atribui o animal, atualiza estado de quem adotou.
   *  5) Ao final, revalida o caso especial do "Loco" (jabuti):
   *     - Precisa de TODOS os brinquedos dele
   *     - E a pessoa já deve ter companhia (>= 2 animais no total)
   *     Se falhar, desfaz a adoção do Loco e ele fica no abrigo.
   *
   * @param {string[]} p1Toys Lista de brinquedos da pessoa 1
   * @param {string[]} p2Toys Lista de brinquedos da pessoa 2
   * @param {string[]} ordemAnimais Ordem de avaliação dos animais
   * @returns {Record<string, 'abrigo' | 'pessoa 1' | 'pessoa 2'>} destino final de cada animal
   */
  #processaAdocoes(p1Toys, p2Toys, ordemAnimais) {
    // Estado cumulativo de cada pessoa
    const estado = {
      1: { total: 0, gatos: 0, possuiOutroAnimal: false },
      2: { total: 0, gatos: 0, possuiOutroAnimal: false },
    };

    // Resultado final: para cada animal, "abrigo", "pessoa 1" ou "pessoa 2"
    const destino = {};

    // Registro de quem poderia adotar (só informativo aqui)
    const candidatos = {};

    for (const nome of ordemAnimais) {
      const info = this.catalogo[nome];
      const fav = info.brinquedos;

      // Verifica elegibilidade de cada pessoa para o animal atual.
      const pode1 = this.#pessoaElegivelParaAnimal(1, info, fav, p1Toys, estado, nome);
      const pode2 = this.#pessoaElegivelParaAnimal(2, info, fav, p2Toys, estado, nome);

      candidatos[nome] = new Set();
      if (pode1) candidatos[nome].add(1);
      if (pode2) candidatos[nome].add(2);

      // Se ambos podem, fica no abrigo (empate).
      if (pode1 && pode2) {
        destino[nome] = 'abrigo';
        continue;
      }

      // Se ninguém pode, fica no abrigo.
      const vencedor = pode1 ? 1 : pode2 ? 2 : null;
      if (vencedor === null) {
        destino[nome] = 'abrigo';
        continue;
      }

      // Regras de limite de adoções por pessoa.
      if (estado[vencedor].total >= 3) {
        destino[nome] = 'abrigo';
        continue;
      }

      // Regra: no máximo 1 gato por pessoa.
      if (info.tipo === 'gato' && estado[vencedor].gatos >= 1) {
        destino[nome] = 'abrigo';
        continue;
      }

      // Adoção efetivada.
      destino[nome] = `pessoa ${vencedor}`;
      estado[vencedor].total += 1;
      estado[vencedor].possuiOutroAnimal = true;
      if (info.tipo === 'gato') estado[vencedor].gatos += 1;
    }

    // Pós-processamento específico para o "Loco" (jabuti).
    for (const nome of Object.keys(destino)) {
      if (nome !== 'Loco') continue;

      const quem = destino[nome];
      if (quem === 'abrigo') continue; // já estava no abrigo, nada a fazer

      const vencedor = quem === 'pessoa 1' ? 1 : 2;

      // Para ficar com o Loco, a pessoa precisa ter TODOS os brinquedos do Loco.
      const setToys = new Set((vencedor === 1 ? p1Toys : p2Toys));
      const precisa = this.catalogo['Loco'].brinquedos;
      const temTodos = precisa.every((bj) => setToys.has(bj));

      // E precisa já ter companhia (pelo menos 2 animais no total).
      const possuiCompanhia = (estado[vencedor].total >= 2);

      // Se falhar em qualquer uma das duas condições, desfaz a adoção do Loco.
      if (!temTodos || !possuiCompanhia) {
        destino[nome] = 'abrigo';
        estado[vencedor].total -= 1;
      }
    }

    return destino;
  }

  /**
   * Determina se uma pessoa é elegível a um animal específico.
   *  - Para o "Loco": a pessoa precisa ter TODOS os brinquedos do jabuti.
   *  - Para os demais: é suficiente conter a sequência (subsequência em ordem)
   *    dos brinquedos favoritos do animal dentro da lista da pessoa.
   *
   * @param {1|2} idxPessoa índice da pessoa (informativo)
   * @param {{tipo:string, brinquedos:string[]}} infoAnimal dados do animal
   * @param {string[]} favs brinquedos favoritos do animal
   * @param {string[]} toysPessoa lista de brinquedos da pessoa
   * @param {{[k:number]:{total:number,gatos:number,possuiOutroAnimal:boolean}}} estado estado acumulado (não usado diretamente aqui, mas passado para contexto)
   * @param {string} nomeAnimal nome do animal (para regra do Loco)
   * @returns {boolean} se a pessoa é elegível
   */
  #pessoaElegivelParaAnimal(idxPessoa, infoAnimal, favs, toysPessoa, estado, nomeAnimal) {
    // Regra especial do jabuti "Loco": precisa ter TODOS os brinquedos dele.
    if (nomeAnimal === 'Loco') {
      const set = new Set(toysPessoa);
      return favs.every((bj) => set.has(bj));
    }

    // Para os demais animais: checa se a lista da pessoa contém a subsequência favs.
    return this.#contemSubsequencia(toysPessoa, favs);
  }

  /**
   * Verifica se "padrao" aparece como SUBSEQUÊNCIA em "lista".
   * Ex.: lista = [A, B, C, D], padrao = [B, D] -> true (mantém ordem, não precisa ser contíguo).
   * @param {string[]} lista
   * @param {string[]} padrao
   * @returns {boolean}
   */
  #contemSubsequencia(lista, padrao) {
    if (padrao.length === 0) return true;
    let i = 0;
    for (const item of lista) {
      if (item === padrao[i]) {
        i += 1;
        if (i === padrao.length) return true;
      }
    }
    return false;
  }
}




export { AbrigoAnimais as AbrigoAnimais };

