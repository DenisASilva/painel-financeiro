export const API_URL = "https://script.google.com/macros/s/AKfycbzn3YUW4FJLUCyk5zgpTdqWIIRGONaTJu7ZElKo7XqdizW0tZesFFF3b6g-B_ZJ3-GV/exec"

export async function salvarNoSheets(tipo, dados) {
  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain",
    },
    body: JSON.stringify({ tipo, dados }),
  });
}
export async function excluirDoSheets(id, aba) {
  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        tipo: {
          tipo: "delete",
          dados: {
            id,
            aba,
          },
        },
      }),
    });
  } catch (error) {
    console.error("Erro ao excluir:", error);
  }
}