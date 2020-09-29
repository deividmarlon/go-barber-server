# [X] Recuperação de senha

**RF** Requisitos funcionais

- O ususário deve poder recuperar sua senha informando o seu e-mail;
- O ususário deve receber um email com instruções de recuperação de senha;
- O ususário deve poder resetar sua senha;

**RNF** Requisitor não funcionais

- Utilizar Mailtrap para testar envios de email em ambiente dev
- Utilizar Amazon SES para envios de email em produção;
- O envio de emails deve acontecer em segundo plano (Background job);

**RN** Regras de negócio

- O link enviado para resetar senha deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar senha;

# [ ] Atualização de perfil

**RF**

- O ususário deve poder atualizar seu nome, email e senha;

**RN** Regras de negócios sempre referenciam à um RF

- O usuário não pode alterar seu email para um email já utilizado por outro usuário;
- Para atualizar sua senha, o usuário deve informar a senha antiga;
- Para atualizar sua senha, o suusário deve confirmar a nova senha;



# [ ] Painel do prestador de serviço

**RF**

- O usuário deve poder listar seus agendamentos de um dia específicio / por dia;
- O prestador deve receber uma notificação sempre que houver um agendamento;
- O prestador deve pode visualizar as notificações não lidas;

**RNF**

- Os agendamentos no prestador no dia específico, devem ser armazenados em cash;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;

**RN**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;

# [ ] Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviços cadastrados
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador;
- O usuário deve realizar um novo agendamento com um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;


**RN**

- Cada agendamento deve durar exatamente uma hora;
- Os agendamentos devem estar disponíveis entre 08h da manhã às 17h;
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar consigo mesmo;
