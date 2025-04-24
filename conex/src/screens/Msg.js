import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { collection, addDoc, query, onSnapshot, doc, orderBy } from "firebase/firestore";

export default function Msg() {
  const [usuarios, setUsuarios] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [contatoSelecionado, setContatoSelecionado] = useState(null);
  const user = auth.currentUser;

  // Buscar usuários disponíveis
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      setUsuarios(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  // Carregar mensagens do usuário selecionado
  useEffect(() => {
    if (contatoSelecionado) {
      const chatId = [user.uid, contatoSelecionado.id].sort().join("_");
      const mensagensRef = query(collection(db, `chats/${chatId}/mensagens`), orderBy("timestamp"));

      const unsubscribe = onSnapshot(mensagensRef, (snapshot) => {
        setMensagens(snapshot.docs.map(doc => doc.data()));
      });

      return () => unsubscribe();
    }
  }, [contatoSelecionado]);

  // Enviar mensagem
  const enviarMensagem = async () => {
    if (!mensagem.trim() || !contatoSelecionado) return;

    try {
      const chatId = [user.uid, contatoSelecionado.id].sort().join("_");
      await addDoc(collection(db, `chats/${chatId}/mensagens`), {
        remetente: user.uid,
        texto: mensagem,
        fotoRemetente: user.photoURL || "https://i.pravatar.cc/100",
        timestamp: new Date(),
      });

      setMensagem("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <View style={styles.container}>
      {!contatoSelecionado ? (
        <>
          <Text style={styles.titulo}>Usuários Online</Text>
          <FlatList
            data={usuarios.filter(u => u.id !== user.uid)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.usuario} onPress={() => setContatoSelecionado(item)}>
                <Image source={{ uri: item.foto || "https://i.pravatar.cc/100" }} style={styles.avatar} />
                <Text style={styles.nomeUsuario}>{item.nome}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      ) : (
        <>
          <Text style={styles.titulo}>Chat com {contatoSelecionado.nome}</Text>
          <FlatList
            data={mensagens}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <View style={[styles.mensagemContainer, item.remetente === user.uid && styles.mensagemEnviadaContainer]}>
                  <Image source={{ uri: item.remetente === user.uid ? user.photoURL : contatoSelecionado.foto || "https://i.pravatar.cc/100" }} 
                         style={styles.avatarMensagem} />
                  <View style={[styles.mensagem, item.remetente === user.uid && styles.mensagemEnviada]}>
                    <Text>{item.texto}</Text>
                  </View>
                </View>
              )}
            />
          <TextInput
            style={styles.input}
            value={mensagem}
            onChangeText={setMensagem}
            placeholder="Digite sua mensagem..."
          />
          <TouchableOpacity style={styles.botao} onPress={enviarMensagem}>
            <Text style={styles.botaoTexto}>Enviar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  usuario: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#fff", borderRadius: 8, marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  nomeUsuario: { fontSize: 18, fontWeight: "bold" },
  mensagemContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  mensagemEnviadaContainer: { flexDirection: "row-reverse" }, // Inverte para mensagens enviadas pelo próprio usuário
  avatarMensagem: { width: 35, height: 35, borderRadius: 20, marginRight: 10 },
  mensagem: { padding: 10, backgroundColor: "#ddd", borderRadius: 8 },
  mensagemEnviada: { backgroundColor: "#1abc9c", color: "#fff" },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginTop: 10 },
  botao: { backgroundColor: "#16a085", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
  botaoTexto: { color: "#fff", fontWeight: "bold" },
});
