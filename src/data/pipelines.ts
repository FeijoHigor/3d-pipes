import type { Pipeline } from "../types";

const pipelines: Pipeline[] = [
  {
    id: "pet-suporte",
    name: "Pet no Suporte",
    description:
      "Gera um modelo 3D do seu pet em cima de uma base personalizada com o nome gravado. Perfeito para impressão 3D.",
    icon: "🐾",
    style: "Escultura colorida estilo estatueta, acabamento fosco",
    outputFormat: ".stl / .glb",
    promptBase:
      "Colorful 3D figurine of a {pet_type}, cute chibi proportions, standing on a cylindrical base with the name \"{pet_name}\" engraved, neutral white background, diffuse lighting, consistent style, no shadows, no background elements",
    promptRules: [
      "Manter proporções chibi (cabeça grande, corpo compacto)",
      "Base cilíndrica com nome legível",
      "Cores vibrantes e acabamento fosco",
      "Pet centralizado na base",
    ],
    steps: [
      {
        id: "upload-pet",
        type: "upload",
        title: "Foto do Pet",
        description: "Envie uma foto clara do seu pet, de preferência com o corpo todo visível e fundo simples.",
        inputs: [
          {
            id: "pet_photo",
            label: "Foto do pet",
            type: "photo",
            required: true,
          },
        ],
      },
      {
        id: "info-pet",
        type: "input",
        title: "Informações do Pet",
        description: "Conte-nos mais sobre o seu pet para personalizar o modelo.",
        inputs: [
          {
            id: "pet_name",
            label: "Nome do pet",
            type: "text",
            placeholder: "Ex: Bidu",
            required: true,
          },
          {
            id: "pet_type",
            label: "Tipo / Raça",
            type: "text",
            placeholder: "Ex: Golden Retriever, Gato Siamês",
            required: true,
          },
          {
            id: "base_color",
            label: "Cor da base",
            type: "select",
            options: ["Branco", "Preto", "Madeira", "Dourado", "Prata"],
            required: true,
          },
        ],
      },
      {
        id: "generate-images",
        type: "generate",
        title: "Gerar Imagens de Referência",
        description:
          "O sistema gerará 3 imagens do seu pet em ângulos diferentes (frente, lado, 3/4) usando IA generativa.",
      },
      {
        id: "review-images",
        type: "review",
        title: "Revisar Imagens",
        description:
          "Confira as imagens geradas. Você pode aprovar ou pedir uma nova geração se não ficou bom.",
      },
      {
        id: "reconstruct-3d",
        type: "reconstruct",
        title: "Reconstrução 3D",
        description:
          "As imagens aprovadas serão enviadas para o modelo de reconstrução 3D para gerar o arquivo final.",
      },
      {
        id: "output",
        type: "output",
        title: "Modelo Pronto!",
        description:
          "Seu modelo 3D está pronto. Faça o download nos formatos disponíveis.",
      },
    ],
  },
  {
    id: "chaveiro-caricatura",
    name: "Chaveiro Caricatura",
    description:
      "Cria um modelo 3D do seu rosto em estilo caricatura no formato de chaveiro, pronto para impressão.",
    icon: "😄",
    style: "Caricatura com cabeça exagerada, corpo minúsculo, formato flat com espessura para impressão",
    outputFormat: ".stl",
    promptBase:
      "Caricature 3D keychain of a person, exaggerated head with tiny body, flat medallion shape with 3mm thickness, small hole at top for keyring, neutral background, consistent style, diffuse lighting",
    promptRules: [
      "Formato flat tipo medalhão com 3mm de espessura",
      "Furo no topo para argola de chaveiro",
      "Traços exagerados estilo caricatura",
      "Proporção cabeça grande, corpo minúsculo",
    ],
    steps: [
      {
        id: "upload-face",
        type: "upload",
        title: "Foto do Rosto",
        description:
          "Envie uma foto clara do seu rosto, de frente, com boa iluminação e sem óculos escuros.",
        inputs: [
          {
            id: "face_photo",
            label: "Foto do rosto",
            type: "photo",
            required: true,
          },
        ],
      },
      {
        id: "info-style",
        type: "input",
        title: "Estilo do Chaveiro",
        description: "Escolha o estilo visual do seu chaveiro.",
        inputs: [
          {
            id: "style",
            label: "Estilo da caricatura",
            type: "select",
            options: ["Engraçado", "Fofo", "Heroico", "Minimalista"],
            required: true,
          },
        ],
      },
      {
        id: "generate-images",
        type: "generate",
        title: "Gerar Imagens de Referência",
        description:
          "O sistema gerará 3 imagens do chaveiro em ângulos diferentes usando IA generativa.",
      },
      {
        id: "review-images",
        type: "review",
        title: "Revisar Imagens",
        description:
          "Confira as imagens geradas. Aprove ou peça uma nova geração.",
      },
      {
        id: "reconstruct-3d",
        type: "reconstruct",
        title: "Reconstrução 3D",
        description:
          "As imagens serão processadas para gerar o modelo 3D do chaveiro.",
      },
      {
        id: "output",
        type: "output",
        title: "Chaveiro Pronto!",
        description:
          "Seu modelo de chaveiro está pronto para download e impressão 3D.",
      },
    ],
  },
  {
    id: "fofinho-chibi",
    name: "Fofinho (Chibi)",
    description:
      "Gera um modelo 3D de você no estilo chibi/fofinho, como um bonequinho colecionável.",
    icon: "🧸",
    style: "Chibi com proporções 1:3, cabeça grande, corpo curto, estilo estatueta",
    outputFormat: ".glb / .stl",
    promptBase:
      "Chibi 3D figurine of a person, 1:3 head-to-body ratio, wearing {outfit_style} clothes, cute collectible toy style, neutral background, diffuse uniform lighting, no shadows, consistent details",
    promptRules: [
      "Proporção 1:3 cabeça para corpo",
      "Estilo bonequinho colecionável (Funko Pop-like)",
      "Sem detalhes muito finos que não imprimem bem",
      "Pose amigável e relaxada",
    ],
    steps: [
      {
        id: "upload-face",
        type: "upload",
        title: "Sua Foto",
        description:
          "Envie uma foto clara do seu rosto e, se possível, corpo inteiro para referência de roupa.",
        inputs: [
          {
            id: "face_photo",
            label: "Sua foto",
            type: "photo",
            required: true,
          },
        ],
      },
      {
        id: "info-chibi",
        type: "input",
        title: "Personalização",
        description: "Customize o estilo do seu bonequinho.",
        inputs: [
          {
            id: "outfit_style",
            label: "Estilo de roupa",
            type: "select",
            options: ["Casual", "Formal", "Esportivo", "Fantasia", "Profissional"],
            required: true,
          },
          {
            id: "outfit_color",
            label: "Cor predominante da roupa",
            type: "text",
            placeholder: "Ex: Azul, Vermelho, Preto",
            required: false,
          },
          {
            id: "accessory",
            label: "Acessório (opcional)",
            type: "text",
            placeholder: "Ex: Óculos, Chapéu, Fone de ouvido",
            required: false,
          },
        ],
      },
      {
        id: "generate-images",
        type: "generate",
        title: "Gerar Imagens de Referência",
        description:
          "O sistema gerará 3 imagens do bonequinho em ângulos diferentes usando IA generativa.",
      },
      {
        id: "review-images",
        type: "review",
        title: "Revisar Imagens",
        description:
          "Confira as imagens do seu chibi. Aprove ou peça uma nova geração.",
      },
      {
        id: "reconstruct-3d",
        type: "reconstruct",
        title: "Reconstrução 3D",
        description:
          "As imagens aprovadas serão transformadas em um modelo 3D.",
      },
      {
        id: "output",
        type: "output",
        title: "Bonequinho Pronto!",
        description:
          "Seu chibi 3D está pronto! Faça o download ou visualize em 3D.",
      },
    ],
  },
];

export default pipelines;
