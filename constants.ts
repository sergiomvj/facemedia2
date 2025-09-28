import { AspectRatio, PromptHelperLanguage } from './types';

export const ASPECT_RATIOS: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];
export const VIDEO_ASPECT_RATIOS: AspectRatio[] = ['16:9', '9:16', '1:1', '4:3', '3:4'];

export const MIN_VIDEO_DURATION = 2;
export const MAX_VIDEO_DURATION = 16;

export const VIDEO_POLLING_MESSAGES = [
  "Warming up the AI engines...",
  "Gathering creative digital particles...",
  "Polling for initial results...",
  "Checking on the video rendering process...",
  "Almost there, adding finishing touches...",
  "Finalizing your video masterpiece...",
];

export const PROMPT_HELPER_CONTENT: Record<PromptHelperLanguage, any> = {
  'EN': {
    tabs: {
      guide: "Prompt Guide",
      editing: "Editing Guide",
      builder: "Prompt Builder",
      styles: "Styles & Keywords",
      negative: "Negative Prompts",
    },
    guideContent: {
      title: "Crafting a Great Prompt",
      p1: "A well-structured prompt is key to getting the image you want. Try to be descriptive and specific. The basic structure is often [Subject], [Style], [Details].",
      example1_title: "Example 1: A Character",
      example1_prompt: "A photo of a wise old wizard with a long white beard, wearing a blue robe adorned with silver stars, holding a glowing crystal staff, standing in an ancient, mystical library filled with floating books, cinematic lighting, detailed, 8k.",
      example2_title: "Example 2: A Landscape",
      example2_prompt: "A breathtaking matte painting of a serene cherry blossom forest in Japan, Mount Fuji in the background under a vibrant sunset, soft pink and orange hues, tranquil river flowing through, Studio Ghibli inspired, highly detailed, epic scale."
    },
    editingContent: {
      title: "Effective Editing Prompts",
      p1: "When editing, be clear about the changes you want. Reference the subject and the desired action.",
      template1_title: "Template: Adding an Element",
      template1_prompt: "Add a [new element] [location relative to existing elements]. Example: Add a small red dragon sitting on the wizard's shoulder.",
      template2_title: "Template: Changing Style",
      template2_prompt: "Change the style to [new style]. Example: Change the style to a Van Gogh painting.",
      template3_title: "Template: Using a Blend Image",
      template3_prompt: "Use the style of the blend image and apply it to the base image. For example, if the base is a portrait and the blend is a starry night painting, the prompt could be 'Apply the starry night style to the portrait.'",
    },
    builderContent: {
      title: "AI Prompt Builder",
      p1: "Let's build a prompt together. Fill in the details below, and our AI assistant will craft a detailed prompt for you.",
      type: "Type (e.g., photo, painting, 3D render)",
      subject: "Main Subject (e.g., a cybernetic owl, a hidden jungle city)",
      style: "Style (e.g., hyperrealistic, anime, watercolor)",
      details: "Key Details (e.g., wearing sunglasses, at night, glowing neon lights)",
      button: "Generate Prompt",
    },
    keywords: {
      photography: "Photography Styles",
      art: "Art Styles",
      artists: "Artists",
      naturalLight: "Natural Lighting",
      artificialLight: "Artificial Lighting",
      effects: "Creative Effects",
    },
    negativePrompts: {
      title: "What are Negative Prompts?",
      p1: "Negative prompts tell the AI what you DON'T want in your image. This is useful for removing common artifacts or unwanted features.",
      p2: "Common keywords to use:",
    },
  },
  'PT-BR': {
    tabs: {
      guide: "Guia de Prompt",
      editing: "Guia de Edição",
      builder: "Construtor de Prompt",
      styles: "Estilos e Palavras-chave",
      negative: "Prompts Negativos",
    },
    guideContent: {
      title: "Criando um Ótimo Prompt",
      p1: "Um prompt bem estruturado é a chave para obter a imagem que você deseja. Tente ser descritivo e específico. A estrutura básica é geralmente [Sujeito], [Estilo], [Detalhes].",
      example1_title: "Exemplo 1: Um Personagem",
      example1_prompt: "Uma foto de um mago sábio e idoso com uma longa barba branca, vestindo um manto azul adornado com estrelas prateadas, segurando um cajado de cristal brilhante, em uma biblioteca antiga e mística cheia de livros flutuantes, iluminação cinematográfica, detalhado, 8k.",
      example2_title: "Exemplo 2: Uma Paisagem",
      example2_prompt: "Uma deslumbrante pintura matte de uma serena floresta de cerejeiras no Japão, com o Monte Fuji ao fundo sob um pôr do sol vibrante, tons suaves de rosa e laranja, um rio tranquilo fluindo, inspirado no Studio Ghibli, altamente detalhado, escala épica."
    },
    editingContent: {
      title: "Prompts de Edição Eficazes",
      p1: "Ao editar, seja claro sobre as mudanças que deseja. Refira-se ao sujeito e à ação desejada.",
      template1_title: "Modelo: Adicionando um Elemento",
      template1_prompt: "Adicione um [novo elemento] [localização relativa aos elementos existentes]. Exemplo: Adicione um pequeno dragão vermelho sentado no ombro do mago.",
      template2_title: "Modelo: Mudando o Estilo",
      template2_prompt: "Mude o estilo para [novo estilo]. Exemplo: Mude o estilo para uma pintura de Van Gogh.",
      template3_title: "Modelo: Usando uma Imagem de Mistura",
      template3_prompt: "Use o estilo da imagem de mistura e aplique-o à imagem base. Por exemplo, se a base é um retrato e a mistura é uma pintura de noite estrelada, o prompt poderia ser 'Aplique o estilo de noite estrelada ao retrato.'",
    },
    builderContent: {
      title: "Construtor de Prompt IA",
      p1: "Vamos construir um prompt juntos. Preencha os detalhes abaixo e nosso assistente de IA criará um prompt detalhado para você.",
      type: "Tipo (ex: foto, pintura, render 3D)",
      subject: "Sujeito Principal (ex: uma coruja cibernética, uma cidade escondida na selva)",
      style: "Estilo (ex: hiper-realista, anime, aquarela)",
      details: "Detalhes Chave (ex: usando óculos de sol, à noite, luzes de neon brilhantes)",
      button: "Gerar Prompt",
    },
    keywords: {
      photography: "Estilos de Fotografia",
      art: "Estilos de Arte",
      artists: "Artistas",
      naturalLight: "Iluminação Natural",
      artificialLight: "Iluminação Artificial",
      effects: "Efeitos Criativos",
    },
    negativePrompts: {
      title: "O que são Prompts Negativos?",
      p1: "Prompts negativos dizem à IA o que você NÃO quer na sua imagem. Isso é útil para remover artefatos comuns ou características indesejadas.",
      p2: "Palavras-chave comuns para usar:",
    },
  },
};

export const KEYWORD_CATEGORIES = {
    photography: ['Cinematic', 'Golden Hour', 'Blue Hour', 'Long Exposure', 'Shallow Depth of Field', 'Macro Photography', 'Film Noir'],
    art: ['Impressionism', 'Surrealism', 'Pop Art', 'Abstract', 'Minimalist', 'Steampunk', 'Cyberpunk', 'Watercolor'],
    artists: ['Van Gogh', 'Salvador Dalí', 'Frida Kahlo', 'H.R. Giger', 'Hayao Miyazaki', 'Greg Rutkowski'],
    naturalLight: ['Soft Sunlight', 'Direct Sunlight', 'Overcast', 'Moonlight', 'Twilight', 'Backlit'],
    artificialLight: ['Neon Lights', 'Studio Lighting', 'Candlelight', 'Spotlight', 'Volumetric Lighting'],
    effects: ['Double Exposure', 'Lens Flare', 'Glow', 'Chromatic Aberration', 'Motion Blur', 'Bokeh'],
};

export const NEGATIVE_KEYWORDS = [
  'ugly', 'deformed', 'disfigured', 'poorly drawn hands', 'poorly drawn feet', 'poorly drawn face', 'out of frame', 'extra limbs', 'body out of frame', 'blurry', 'bad anatomy', 'watermark', 'signature', 'low quality'
];