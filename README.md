# PULZR Mobile

Base atualizada do PULZR com duas frentes no mesmo repositorio:

- `public/`: preview web mobile publicada pela Vercel, usada para validar rapidamente a experiencia visual e os fluxos.
- `App.js`: base React Native/Expo com login, cadastro, feed, treino, perfil, camera/fotos, compartilhamento e Firebase preparado por variaveis `EXPO_PUBLIC_FIREBASE_*`.

## Entrega atual

- Login, cadastro e recuperacao de senha preparada.
- Perfil editavel com foto, nome, telefone, bio e estatisticas.
- Treinos com exercicios, conclusao, foto via camera e legenda.
- Feed social com posts de treino, marca d'agua PULZR, curtidas, comentarios e compartilhamento.
- Aba de desafios, registros de corrida/academia, resultados e navegacao inferior.
- Visual mobile-first preto, neon amarelo/verde, raio PULZR, cards e botoes alinhados as referencias.

## Preview local da Vercel

```bash
npm install
npm run dev
```

## Build web para Vercel

```bash
npm run build
```

A Vercel publica a pasta `dist`, gerada a partir de `public/`.
