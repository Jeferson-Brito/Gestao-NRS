// Dados mockados para funcionar sem backend
export const mockData = {
  users: [
    {
      id: '1',
      username: 'admin',
      email: 'admin@gestao-nrs.com',
      password: 'admin123',
      role: 'admin'
    },
    {
      id: '2',
      username: 'user',
      email: 'user@gestao-nrs.com',
      password: 'user123',
      role: 'user'
    }
  ],
  analistas: [
    { id: '1', nome: "Mahori Silva", turno: "Madrugada", pausa: "01:00 - 02:00", folgaInicial: 7, ativo: true },
    { id: '2', nome: "Gean Nogueira", turno: "Madrugada", pausa: "02:00 - 03:00", folgaInicial: 3, ativo: true },
    { id: '3', nome: "José Matheus", turno: "Matinal", pausa: "09:30 - 10:30", folgaInicial: 2, ativo: true },
    { id: '4', nome: "João Carlos", turno: "Matinal", pausa: "09:00 - 10:00", folgaInicial: 6, ativo: true },
    { id: '5', nome: "Leanderson Mascena", turno: "Manhã", pausa: "13:00 - 14:00", folgaInicial: 7, ativo: true },
    { id: '6', nome: "Rafael Macêdo", turno: "Manhã", pausa: "11:30 - 12:30", folgaInicial: 6, ativo: true },
    { id: '7', nome: "Alesandro Silva", turno: "Tarde", pausa: "19:30 - 20:30", folgaInicial: 6, ativo: true },
    { id: '8', nome: "Paulo Vinícius", turno: "Tarde", pausa: "16:30 - 17:30", folgaInicial: 7, ativo: true },
    { id: '9', nome: "Jailso Maxwell", turno: "Tarde", pausa: "15:30 - 16:30", folgaInicial: 4, ativo: true },
    { id: '10', nome: "Rafael Sousa", turno: "Tarde", pausa: "15:00 - 16:00", folgaInicial: 3, ativo: true }
  ],
  turnos: [
    { id: '1', name: "Madrugada", nome: "Madrugada", horario: "22:00 - 06:00", cor: "#6a1b4d", ordem: 1 },
    { id: '2', name: "Matinal", nome: "Matinal", horario: "05:40 - 14:00", cor: "#8b4513", ordem: 2 },
    { id: '3', name: "Manhã", nome: "Manhã", horario: "07:00 - 15:20", cor: "#c49a30", ordem: 3 },
    { id: '4', name: "Tarde", nome: "Tarde", horario: "13:40 - 22:00", cor: "#1f4e79", ordem: 4 }
  ],
  eventos: [],
  folgasManuais: {}
};

// Função para simular login
export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockData.users.find(u => u.email === email && u.password === password);
      if (user) {
        resolve({
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        });
      } else {
        reject(new Error('Credenciais inválidas'));
      }
    }, 500); // Simular delay de rede
  });
};




