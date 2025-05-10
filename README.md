# Happy Birthday Interactive Card 🎂

An interactive birthday celebration web application built with Next.js, React, and Tailwind CSS. This application allows users to create personalized birthday celebrations with interactive candle-blowing using microphone detection, wish-making, and social sharing features.

<!-- ![Happy Birthday App Screenshot]() -->

## ✨ Features

- 🎂 Interactive birthday cake with blowable candles
- 🎤 Microphone detection for blowing out candles
- 🎁 Personalized birthday messages
- 💫 Wish-making functionality
- 🔗 Social sharing capabilities
- 🌙 Beautiful animations and effects
- 🌐 Arabic language support
- 👫 Gender-specific messages
- 📱 Fully responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js 16.8.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/happy-birthday.git
   cd happy-birthday
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Create the sounds directory and add sound files:
   \`\`\`bash
   mkdir -p public/sounds
   \`\`\`
   
   You'll need to add these sound files:
   - `public/sounds/blow-candle.mp3` - Sound for when candles are blown out
   - `public/sounds/magic-wand.mp3` - Sound for when a wish is sent

   You can find free sound effects at websites like [Freesound](https://freesound.org/), [Pixabay](https://pixabay.com/sound-effects/), or [Zapsplat](https://www.zapsplat.com/).

4. Start the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🧩 Project Structure

\`\`\`
happy-birthday/
├── public/
│   ├── sounds/
│   │   ├── blow-candle.mp3
│   │   └── magic-wand.mp3
├── src/
│   ├── app/
│   │   ├── [name]/
│   │   │   └── page.tsx
│   │   ├── create/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   └── create-celebration/
│   │   │       └── route.ts
│   │   ├── actions.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── animations.tsx
│   │   ├── background-gradient.tsx
│   │   ├── birthday-cake.tsx
│   │   ├── birthday-card.tsx
│   │   ├── cake-tooltip.tsx
│   │   ├── candle.tsx
│   │   ├── header-nav.tsx
│   │   ├── icons.tsx
│   │   ├── mic-button.tsx
│   │   ├── microphone-detector.tsx
│   │   ├── share-link.tsx
│   │   └── wish-form.tsx
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   └── lib/
│       └── utils.ts
\`\`\`

## 🔧 Usage

### Creating a Birthday Celebration

1. Visit the homepage and click on "إنشاء احتفال" (Create Celebration)
2. Enter the name of the person you want to celebrate
3. Select their gender (for proper Arabic language addressing)
4. Click "إنشاء الاحتفال" (Create Celebration)
5. Share the generated link with friends or go directly to the celebration

### Interacting with the Celebration

1. Blow into your microphone or click on the cake to blow out the candles
2. Make a wish by clicking the "اكتب أمنيتك" (Write Your Wish) button
3. Share the celebration with friends using the share options

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and follow the code style of the project.

### Development Guidelines

- Follow the existing code style and structure
- Use TypeScript for type safety
- Use Tailwind CSS for styling
- Test your changes thoroughly
- Document any new features or changes

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🐛 Troubleshooting

### Microphone Issues

If you're experiencing issues with the microphone:

1. Make sure you're using a secure connection (HTTPS)
2. Check that you've granted microphone permissions in your browser
3. Try using a different browser if issues persist
4. You can always click on the cake to blow out the candles manually

### Sound Issues

If sound effects aren't playing:

1. Make sure you have the sound files in the correct location (`public/sounds/`)
2. Check that your browser allows autoplay of audio
3. Verify that your device's sound is turned on

## 📞 Contact

If you have any questions or suggestions, feel free to open an issue or contact the maintainer.

---

Made with ❤️ by AlMonther
\`\`\`


## Authors <img src="https://cdn-icons-png.flaticon.com/128/2463/2463510.png" width=50 align=center>

* AlMonther Abdulhafeez <a href="https://github.com/AlMonther9" a>
<br/>
## 🔗 Connect with Me

- 📧 Email: [ealmonzer667@gmail.com](mailto:ealmonzer667@gmail.com)
- 💼 LinkedIn: [AlMonther Abdulhafeez](https://www.linkedin.com/in/almonther-abdulhafeez-a3a48a267)
