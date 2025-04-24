// Gabriel Moreira e Matheus
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // Biblioteca para escolher imagem
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('https://i.pravatar.cc/300'); // Foto padrão

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const dados = docSnap.data();
            setNome(dados.nome || '');
            setEmail(dados.email || '');
            setBio(dados.bio || '');
            setFotoPerfil(dados.foto || 'https://i.pravatar.cc/300'); // Recuperando foto
          } else {
            setEmail(user.email);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados do perfil:', error);
      }
    };

    carregarDados();
  }, []);

  const selecionarImagem = async () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode) {
        const imageUri = response.assets[0].uri;
        setFotoPerfil(imageUri);
      }
    });
  };

  const salvarPerfil = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'usuarios', user.uid), {
          nome,
          email,
          bio,
          foto: fotoPerfil,
        });
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={selecionarImagem}>
        <Image source={{ uri: fotoPerfil }} style={styles.avatar} />
      </TouchableOpacity>
      <Text style={styles.name}>{nome || 'Usuário'}</Text>
      <Text style={styles.email}>{email}</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Seu nome" placeholderTextColor="#aaa" />

      <Text style={styles.label}>Sobre você</Text>
      <TextInput style={[styles.input, { height: 100 }]} value={bio} onChangeText={setBio} placeholder="Fale um pouco sobre você..." multiline placeholderTextColor="#aaa" />

      <TouchableOpacity style={styles.button} onPress={salvarPerfil}>
        <Text style={styles.buttonText}>Salvar alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f4f4',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#1abc9c',
    marginTop: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 14,
    color: '#00849a',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#1abc9c',
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
