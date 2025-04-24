// Gabriel Moreira
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../../firebaseConfig';
import { collection, query, onSnapshot } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

export default function NotificationScreen() {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'postagens'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaNotificacoes = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          usuario: data.usuario,
          texto: data.texto ? `"${data.texto}"` : '[Imagem]',
          hora: new Date(doc._document.createTime.timestamp.seconds * 1000).toLocaleString(),
        };
      });

      // Ordena notificações da mais recente para a mais antiga
      listaNotificacoes.sort((a, b) => new Date(b.hora) - new Date(a.hora));

      setNotificacoes(listaNotificacoes);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        <Icon name="notifications" size={24} color="#f39c12" /> Notificações
      </Text>

      {notificacoes.length === 0 ? (
        <Text style={styles.semNotificacoes}>Nenhuma nova publicação ainda...</Text>
      ) : (
        <FlatList
          data={notificacoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notificacao}>
              <Text style={styles.texto}>
                <Text style={styles.usuario}>{item.usuario}</Text> publicou {item.texto} às {item.hora}.
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  semNotificacoes: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  notificacao: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  usuario: {
    fontWeight: 'bold',
  },
  texto: {
    fontSize: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center', // Centraliza o texto
    marginVertical: 25, // Adiciona espaçamento no topo e na base
  },
});
