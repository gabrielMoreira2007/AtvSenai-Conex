// Gabriel Moreira
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { auth, db } from '../../firebaseConfig';
import { collection, addDoc, query, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  const [postagemTexto, setPostagemTexto] = useState('');
  const [postagemImagem, setPostagemImagem] = useState('');
  const [postagens, setPostagens] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'postagens'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listaPostagens = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostagens(listaPostagens);
    });

    return () => unsubscribe();
  }, []);

  const selecionarImagem = async () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode) {
        setPostagemImagem(response.assets[0].uri);
      }
    });
  };

  const obterNomeUsuario = async (user) => {
    if (user.displayName) {
      return user.displayName;
    }
    const docRef = doc(db, 'usuarios', user.uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().nome : 'Usuário desconhecido';
  };

  const criarPostagem = async () => {
    if (!postagemTexto.trim() && !postagemImagem) {
      Alert.alert('Erro', 'Por favor, escreva algo ou selecione uma imagem antes de postar.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const nomeUsuario = await obterNomeUsuario(user);
        await addDoc(collection(db, 'postagens'), {
          usuario: nomeUsuario,
          texto: postagemTexto.trim(),
          imagem: postagemImagem || null,
          curtidas: 0,
          comentarios: [],
        });
        setPostagemTexto('');
        setPostagemImagem('');
        Alert.alert('Sucesso', 'Postagem criada!');
      }
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
    }
  };

  const curtirPostagem = async (id, curtidas) => {
    try {
      const postRef = doc(db, 'postagens', id);
      await updateDoc(postRef, { curtidas: curtidas + 1 });
    } catch (error) {
      console.error('Erro ao curtir postagem:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Criar Postagem */}
      <Text style={styles.titulo}>Nova Postagem</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite algo..."
        value={postagemTexto}
        onChangeText={setPostagemTexto}
      />
      {postagemImagem ? <Image source={{ uri: postagemImagem }} style={styles.imagemPreview} /> : null}
      <TouchableOpacity style={styles.botao} onPress={selecionarImagem}>
        <Text style={styles.botaoTexto}>Selecionar Imagem</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botao} onPress={criarPostagem}>
        <Text style={styles.botaoTexto}>Postar</Text>
      </TouchableOpacity>

      {/* Lista de Postagens */}
      <FlatList
        data={postagens}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.postagem}>
            <Text style={styles.usuario}>{item.usuario}</Text> 
            {item.imagem ? <Image source={{ uri: item.imagem }} style={styles.imagemPost} /> : null}
            <Text style={styles.textoPostagem}>{item.texto}</Text>
            <TouchableOpacity onPress={() => curtirPostagem(item.id, item.curtidas)} style={styles.botaoCurtir}>
              <Icon name="heart" size={24} color="#e74c3c" />
              <Text style={styles.textoCurtidas}>{item.curtidas}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 17,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#1abc9c',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postagem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  usuario: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textoPostagem: {
    fontSize: 16,
    marginBottom: 5,
  },
  botaoCurtir: {
    color: '#e74c3c',
    fontSize: 16,
  },
  imagemPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagemPost: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 10,
  },
  botaoCurtir: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoCurtidas: {
    fontSize: 16,
    marginLeft: 5,
  },  
});
