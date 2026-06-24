# PULZR Mobile

App React Native (Expo) da comunidade fechada fitness PULZR.

## Entrega atual

- Login, cadastro e recuperacao de senha preparada.
- Perfil editavel com foto, nome, telefone, bio e estatisticas.
- Treinos com exercicios, conclusao, foto via camera e legenda.
- Feed social com posts de treino, marca d'agua PULZR, curtidas, comentarios e compartilhamento nativo.
- Aba de desafios, aba Pulso com estatisticas e navegacao inferior.
- Firebase preparado por variaveis `EXPO_PUBLIC_FIREBASE_*`; enquanto as chaves nao forem configuradas, o app usa persistencia local com AsyncStorage.
- Visual mobile-first preto, neon amarelo/verde, raio PULZR, cards e botoes alinhados as referencias.

## Rodar localmente

```bash
npm install
npm run start
```

## Rodar no navegador

```bash
npm run web
```

## Build web para Vercel

```bash
npm run build
```

A Vercel deve publicar a pasta `dist` gerada pelo Expo.
