# desafio-nanbreno-2025
Desafio técnico do projeto DB Starter

Sobre

Projeto desenvolvido para o Desafio Técnico do Programa de Estágio START DB.
O objetivo é criar um sistema em JavaScript que simula a adoção de animais de um abrigo, respeitando algumas regras específicas.

Regras

A pessoa só adota se tiver todos os brinquedos do animal na ordem certa.

Gatos não compartilham: se mais de uma pessoa atender, o gato fica no abrigo.

Cada pessoa pode adotar no máximo 3 animais.

Loco (jabuti) aceita qualquer ordem de brinquedos, mas só se for junto com outro animal.

Animais
| Animal | Tipo   | Brinquedos Favoritos |
| ------ | ------ | -------------------- |
| Rex    | Cão    | RATO, BOLA           |
| Mimi   | Gato   | BOLA, LASER          |
| Fofo   | Gato   | BOLA, RATO, LASER    |
| Zero   | Gato   | RATO, BOLA           |
| Bola   | Cão    | CAIXA, NOVELO        |
| Bebe   | Cão    | LASER, RATO, BOLA    |
| Loco   | Jabuti | SKATE, RATO          |

Como Funciona

Valida os dados de entrada.

Confere compatibilidade dos brinquedos.

Aplica as regras especiais (gatos e Loco).

Retorna a lista final de adoções.

Testes

O projeto usa Jest para validar a lógica.

Clone o repositório.

Rode npm install.

Execute npm test.

Aprendizado

Com esse desafio pude praticar:

Lógica de programação

Estruturação de código

Testes automatizados
