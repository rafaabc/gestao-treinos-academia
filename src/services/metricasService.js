const { users } = require('../models/db');
const { treinos } = require('../models/db');

exports.getMetricas = (username) => {
  const user = users[username];
  if (!user) throw new Error('Usuário não encontrado');
  const meta = user.meta || 200;
  const treinosUser = treinos[username] || [];
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth() + 1;
  const totalAno = treinosUser.filter(t => t.ano == anoAtual).length;
  const totalMes = treinosUser.filter(t => t.ano == anoAtual && t.mes == mesAtual).length;
  const porcentagem = meta ? Math.round((totalAno / meta) * 100) : 0;
  return { meta, totalAno, totalMes, porcentagem };
};

exports.setMeta = (username, meta) => {
  if (!users[username]) throw new Error('Usuário não encontrado');
  if (typeof meta !== 'number' || meta <= 0) {
    throw new Error('Meta anual deve ser um número maior que zero');
  }
  users[username].meta = meta;
};
