# 3D Model Pipeline Builder

## Visão Geral

Uma plataforma para geração automatizada de **modelos 3D prontos para impressão ou uso digital**, a partir de fotos enviadas pelo usuário.

O usuário seleciona uma pipeline (ex: "Pet no suporte", "Chaveiro caricatura"), fornece os inputs necessários (foto, nome, etc.) e a plataforma cuida de todo o processo: gera as imagens de referência em múltiplos ângulos via IA generativa e entrega o modelo 3D final.

---

## Fluxo Central (comum a todas as pipelines)

Toda pipeline segue esta estrutura base:

```
[Input do usuário]
  (foto, nome, parâmetros)
        |
        v
[Geração de imagens de referência via IA]
  - ~3 imagens em ângulos diferentes (frente, lado, trás ou 3/4)
  - Prompt base da pipeline + regras de consistência para reconstrução 3D
  - Fundo neutro, iluminação uniforme, sem oclusões
        |
        v
[Seleção / aprovação das imagens]  ← usuário pode reprovar e regerar
        |
        v
[Reconstrução 3D]
  - Imagens enviadas para modelo image-to-3D
  - (ex: Tripo3D, Meshy, Rodin, InstantMesh)
        |
        v
[Modelo 3D entregue]
  - Download do arquivo (.glb / .obj / .stl)
  - Preview interativo no browser
```

---

## Regras de Prompt para Geração 3D

Todas as pipelines aplicam automaticamente um conjunto de regras no prompt para garantir que as imagens sirvam bem à reconstrução 3D:

- Fundo branco ou cinza neutro, sem sombras projetadas
- Iluminação difusa uniforme, sem reflexos especulares fortes
- Objeto centralizado e sem cortes nas bordas
- Estilo consistente entre as 3 imagens (mesma paleta, mesmo nível de detalhe)
- Sem elementos 2D, colagens ou sobreposições gráficas
- Ângulos padrão: frontal (0°), lateral (90°) e 3/4 frontal (45°)

Cada pipeline pode adicionar suas próprias restrições além dessas.

---

## Conceitos Principais

### Pipeline
Template pré-configurado que define:
- O **estilo visual** do objeto 3D a ser gerado
- O **prompt base** (incluindo as regras 3D)
- Os **inputs necessários** do usuário (foto, texto, etc.)
- Os **parâmetros configuráveis** expostos ao usuário

### Etapa (Step)

| Tipo | Descrição |
|---|---|
| `upload` | Recebe arquivo do usuário (foto de referência) |
| `input` | Coleta texto do usuário (nome, cor, descrição) |
| `generate` | Gera imagens via IA com prompt configurado |
| `review` | Usuário aprova ou solicita regeração das imagens |
| `reconstruct` | Envia imagens para o modelo image-to-3D |
| `output` | Entrega o modelo 3D ao usuário |

---

## Catálogo de Pipelines

### 🐾 Pet no Suporte
Gera um modelo 3D do pet do usuário em cima de uma base personalizada com o nome gravado.

**Inputs:** foto do pet, nome do pet, cor do suporte  
**Estilo:** escultura colorida estilo estatueta, acabamento fosco  
**Saída:** modelo 3D `.stl` / `.glb` pronto para impressão 3D

**Prompt base (exemplo):**
> Colorful 3D figurine of a [raça/tipo do pet], cute chibi proportions, standing on a cylindrical base with the name "[nome]" engraved, neutral white background, diffuse lighting, front/side/3/4 view, consistent style, no shadows, no background elements

---

### 😄 Chaveiro Caricatura
Gera um modelo 3D de uma caricatura do rosto do usuário no formato de chaveiro.

**Inputs:** foto do rosto do usuário  
**Estilo:** caricatura exagerada com cabeça grande, corpo minúsculo, formato flat com espessura para impressão  
**Saída:** modelo 3D `.stl` com furo para argola

**Prompt base (exemplo):**
> Caricature 3D keychain of a person, exaggerated head with tiny body, flat medallion shape with 3mm thickness, small hole at top for keyring, neutral background, front/side/3/4 view, consistent style, no background, diffuse lighting

---

### 🧸 Fofinho (Chibi)
Gera um modelo 3D da pessoa no estilo chibi/fofinho, como um bonequinho colecionável.

**Inputs:** foto do rosto do usuário, cor de roupa desejada  
**Estilo:** chibi com proporções 1:3 (cabeça grande, corpo curto), estilo estatueta  
**Saída:** modelo 3D `.glb` / `.stl`

**Prompt base (exemplo):**
> Chibi 3D figurine of a person, 1:3 head-to-body ratio, wearing [cor/estilo de roupa], cute collectible toy style, neutral background, diffuse uniform lighting, front/side/3/4 view, no shadows, consistent details

---

## Arquitetura Técnica (Rascunho)

```
Frontend (Next.js / React)
  └── Catálogo de pipelines
  └── Interface de execução passo a passo
  └── Viewer 3D interativo (Three.js / model-viewer)

Backend (Node.js / Python)
  └── Pipeline runner (executa as etapas em sequência)
  └── Job queue para tarefas assíncronas (geração de imagem, reconstrução 3D)
  └── Integrações:
        ├── IA Generativa: OpenAI DALL-E 3, Stability AI, Flux
        ├── Image-to-3D: Tripo3D, Meshy AI, Rodin, InstantMesh
        └── Storage: S3 / Cloudflare R2

Banco de Dados
  └── Definições de pipelines e etapas
  └── Jobs de execução por usuário (inputs, imagens geradas, modelo final)
  └── Histórico e resultados
```

---

## Diferenciais e Pontos de Atenção

- **Regras 3D automáticas**: o usuário não precisa saber nada sobre prompts — as regras de consistência são aplicadas pela plataforma
- **Aprovação por etapa**: o usuário pode reprovar as imagens geradas e pedir uma nova geração antes de pagar pelo processamento 3D
- **Extensibilidade**: novas pipelines são criadas apenas configurando prompt, inputs e estilo — sem código novo
- **Feedback em tempo real**: progresso visível em cada etapa (geração, reconstrução, entrega)
- **Orientado a produto físico**: saída pensada para impressão 3D (`.stl` com suportes, escala correta)

---

## Próximos Passos

- [ ] Validar qual API image-to-3D entrega melhor resultado (Tripo3D vs Meshy vs Rodin)
- [ ] Testar prompts das 3 pipelines iniciais e refinar regras de ângulo/iluminação
- [ ] Desenhar modelo de dados (pipelines, steps, jobs, outputs)
- [ ] Definir quando cobrar do usuário (antes da reconstrução 3D ou só no download)
- [ ] Prototipar a interface de execução de pipeline (wizard passo a passo)
- [ ] Implementar MVP com a pipeline "Pet no Suporte"