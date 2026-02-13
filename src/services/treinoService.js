const { treinos } = require('../models/db');

exports.getCalendario = (username, mes, ano) => {
  if (!treinos[username]) treinos[username] = [];
  return treinos[username].filter(t => t.mes == mes && t.ano == ano);
};

exports.marcarTreino = (username, dia, mes, ano) => {
  if (!treinos[username]) treinos[username] = [];
  if (treinos[username].some(t => t.dia == dia && t.mes == mes && t.ano == ano)) throw new Error('Treino já marcado para este dia');
  treinos[username].push({ dia, mes, ano });
};

exports.desmarcarTreino = (username, dia, mes, ano) => {
  if (!treinos[username]) treinos[username] = [];
  const idx = treinos[username].findIndex(t => t.dia == dia && t.mes == mes && t.ano == ano);
  if (idx === -1) throw new Error('Treino não encontrado');
  treinos[username].splice(idx, 1);
};
