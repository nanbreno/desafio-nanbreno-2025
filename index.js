// Importa a classe principal 'AbrigoAnimais' de seu módulo.
// Essa abordagem modular facilita a organização e a manutenção do código,
// permitindo que a lógica de negócios esteja isolada e seja reutilizável.
import { AbrigoAnimais } from './src/abrigo-animais.js';

// Instancia a classe 'AbrigoAnimais', criando um objeto que representa o sistema do abrigo.
// A utilização de classes e instâncias é uma prática de Programação Orientada a Objetos (POO),
// que encapsula dados e comportamentos em uma única estrutura.
const abrigo = new AbrigoAnimais();

// --- Cenário de Teste 1: Adoção bem-sucedida ---
// Este bloco simula uma operação real do sistema.
// Ele invoca o método 'encontraPessoas' com três parâmetros:
// 1. Uma string com os brinquedos da Pessoa 1, separados por vírgula.
// 2. Uma string com os brinquedos da Pessoa 2, separados por vírgula.
// 3. Uma string com os nomes dos animais a serem avaliados, em ordem de prioridade.
// A saída esperada demonstra que o sistema processou as regras de adoção.
// O 'Rex' foi adotado pela 'pessoa 1' por ter os brinquedos compatíveis, enquanto o 'Fofo'
// permaneceu no abrigo, indicando que nenhuma pessoa atendeu aos seus requisitos de adoção.
console.log(abrigo.encontraPessoas('RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo'));

// --- Cenário de Teste 2: Validação de Entrada ---
// Este segundo teste demonstra a robustez do sistema frente a dados inválidos.
// Ao passar um animal ('Lulu') que não está cadastrado na base de dados do abrigo,
// o método 'encontraPessoas' retorna um objeto de erro.
// Isso indica que a função possui validações de entrada, prevenindo que o processamento
// continue com informações incorretas e garantindo a integridade do sistema.
console.log(abrigo.encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu'));