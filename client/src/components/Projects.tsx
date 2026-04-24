import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, ChevronDown, ChevronUp } from 'lucide-react';
import PR1 from '@assets/generated_images/Projects/1.png';
import PR2 from '@assets/generated_images/Projects/2.jpg';
import PR3 from '@assets/generated_images/Projects/3.jpg';
import PR4 from '@assets/generated_images/Projects/4.jpg';
import PR5 from '@assets/generated_images/Projects/5.png';
import PR6 from '@assets/generated_images/Projects/6.jpg';
import PR7 from '@assets/generated_images/Projects/7.webp';
import PR8 from '@assets/generated_images/Projects/8.webp';
import PR9 from '@assets/generated_images/Projects/9.png';
import PR10 from '@assets/generated_images/Projects/10.webp';
import PR11 from '@assets/generated_images/Projects/11.jpg';
import PR12 from '@assets/generated_images/Projects/12.jpg';
import PR13 from '@assets/generated_images/Projects/13.png';
import PR14 from '@assets/generated_images/Projects/14.jpeg';
import PR15 from '@assets/generated_images/Projects/15.webp';
import PR16 from '@assets/generated_images/Projects/16.jpg';
import PR17 from '@assets/generated_images/Projects/17.jpg';
import PR18 from '@assets/generated_images/Projects/18.png';
import PR19 from '@assets/generated_images/Projects/19.png';
import PR20 from '@assets/generated_images/Projects/20.png';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  githubUrl: string;
  technologies: string[];
}

const projects: Project[] = [
    {
    id: 8,
    title: " Multi-Agentic Hybrid RAG System with Fine-Tuned LLMs for Financial Intelligence",
    description: "Built and deployed a production-grade, multi-tenant AI system that transforms unstructured financial documents (annual reports, credit agreements, earnings calls, etc.) into structured, explainable credit risk insights in minutes.The system combines a multi-agent orchestration pipeline (LangGraph), fine-tuned LLaMA for financial extraction, dual FinBERT models for sentiment and covenant breach detection, and an XGBoost-based risk engine with SHAP explainability. It also integrates a hybrid RAG architecture (dense + sparse retrieval, HyDE, and cross-encoder re-ranking) to enable grounded document-level Q&A. Designed with asynchronous processing (Celery + Redis), vector search (Qdrant), and secure multi-tenant architecture, the platform is fully containerized and deployed on AWS, supporting real-world scalability, auditability, and decision-grade reliability.",
    image: PR20,
    githubUrl: "https://github.com/mohamedsahadm786/finsight-ai",
    technologies: ["LLaMA","QLoRA","FinBERT","XGBoost","LangGraph","Hybrid RAG","Docker","Kubernetes","Prometheus","Grafana","RAGAS","LangSmith","AWS"]
  },
    {
    id: 8,
    title: "Multi-Tenant Agentic AI SaaS for Global Supplier Risk Intelligence (AWS Deployed)",
    description: "Built and deployed a production-grade, multi-tenant Agentic AI SaaS platform on AWS that automates global supplier due diligence using a 5-agent orchestration workflow and 4 MCP tool layers, reducing a 3–5 day manual compliance process to under 5 minutes with explainable, database-backed risk intelligence.",
    image: PR19,
    githubUrl: "https://github.com/mohamedsahadm786/agentic_supplier_risk_ai",
    technologies: ["Python", "LangGraph", "LangChain", "MCP", "LLM", "AWS", "Docker", "FastAPI", "Pydantic", "PostgreSQL"]
  },
  {
    id: 8,
    title: "multilingual AI voice Interview Simulator",
    description: "An AI-powered Interview Coach that simulates realistic, voice-based mock interviews and provides instant feedback on both answer quality and communication style. Designed to help candidates practice confidently, it tailors questions to job roles and resumes while offering personalized tips to improve real-world interview performance.",
    image: PR8,
    githubUrl: "https://github.com/mohamedsahadm786/AI-Powered-Multilingual-Voice-Interview-Simulator",
    technologies: ["AI", "Voice Processing", "Machine Learning", "Interview Coaching", "Multilingual"]
  },
    {
    id: 1,
    title: "Decision Intelligence System for Cost-Aware Machine Learning (AWS Deployed)",
    description: "Designed and deployed a production-ready, decision-centric ML system on AWS (EC2 backend, S3 frontend) that transforms raw business data into cost-optimized decisions by explicitly modeling real-world error trade-offs (false positives vs. false negatives) across both classification and regression use cases, featuring robust preprocessing, interpretable evaluation, and decision-threshold optimization to enable scalable analysis of 10k+ records per run.",
    image: PR18,
    githubUrl: "https://github.com/mohamedsahadm786/No-auto-ml-DS-Project",
    technologies: ["Python", "Scikit-learn", "FastAPI", "AWS (EC2, S3)", "Pandas", "NumPy", "Matplotlib"]
  },
    {
    id: 1,
    title: "Enterprise Insurance Analytics | Policy, Premium & Investment Intelligence",
    description: "Designed and delivered an enterprise-scale insurance analytics solution by modeling 7 structured datasets in a star schema to resolve fragmented policy and premium visibility, enabling end-to-end lifecycle insights across customers, products, sales hierarchy, and geographies, while implementing advanced financial intelligence (Maturity Value, ROI, CAGR, profitability, and premium cash-flow forecasting) to quantify investment performance and long-term liability exposure over a 5–30 year horizon, supporting executive-level decision-making and improving strategic planning and accountability across sales, finance, and operations teams.",
    image: PR17,
    githubUrl: "https://github.com/mohamedsahadm786/Insurance_Analytics",
    technologies: ["Power BI", "Advanced DAX", "Star Schema Data Modeling", "Financial & Insurance Analytics", "Power Query (ETL)", "Row-Level Security (RLS)", "GitHub"]
  },
    {
    id: 1,
    title: "MediBot– Medical RAGChatbot (AWS Deployed|Pinecone |LangChain |OpenAI)",
    description: "Engineered an end-to-end Generative AI medical chatbot using LangChain, OpenAI GPT-4o, HuggingFace embeddings, and Pinecone, enabling context-aware responses from a 700+-page medical corpus with 92% retrieval accuracy and <1-second latency across 10,000+ user queries.Deployed a scalable Flask-based RAG pipeline on AWS EC2 using Docker and automated CI/CD via GitHub Actions, improving deployment efficiency by 60%, reducing manual intervention, and demonstrating full MLOps lifecycle integration from data ingestion to production hosting.",
    image: PR10,
    githubUrl: "https://github.com/mohamedsahadm786/-MediBot_Rag_Pinecone_Aws",
    technologies: [" Pinecone", "LangChain", "AWS", "CI/CD Pipeline"]
  },
  {
    id: 1,
    title: " AI Document-Based Question Generator",
    description: "AI-powered RAG system that ingests PDF/DOCX documents, performs semantic chunking, TF-IDF keyword mining, MiniLM embedding, and FAISS vector retrieval, then uses few-shot LLM prompting to generate difficulty-controlled MCQ/Yes/No/Descriptive/Coding questions with full post-processing (validation, semantic deduplication, quality scoring). Includes a complete web interface (Node.js + Python backend) for document upload, dynamic question generation, and automated answer evaluation.",
    image: PR16,
    githubUrl: "https://github.com/mohamedsahadm786/AI-Document-Based-Question-Generator-",
    technologies: ["LLM Prompt Engineering",
"Retrieval-Augmented Generation (RAG)",
"Semantic Text Chunking",
"FAISS Vector Database",
"SentenceTransformers (MiniLM Embeddings)",
"TF-IDF Keyword Extraction (Scikit-Learn)",
"OpenAI API Integration",
"Few-Shot Learning",
"Embedding-Based Similarity Search",
"Semantic Deduplication",
"Difficulty-Controlled Question Generation",
"PyMuPDF (PDF Extraction)",
"python-docx / docx2txt (Document Parsing)",
"Python Backend Architecture",
"Node.js Web Server",
"Full-Stack AI Integration",
"End-to-End Pipeline Orchestration",
"LLM-Based Answer Evaluation"
]
  },
  {
    id: 1,
    title: "Fine-Tuned Transformer Models for Speaker Confidence Analysis",
    description: "Built a multimodal confidence classification system using VideoMAE and WavLM, turning 42 raw videos into 79 balanced samples through targeted augmentation and pipeline tuning, achieving MAE 0.19, QWK 0.84, and ACC 0.81 across 8–9 fine-tuned transformer models. Engineered a robust PyTorch pipeline with AdamW, attention pooling, and early stopping, and developed a Streamlit interface for real-time video inference and easy model switching, enabling rapid evaluation despite limited data.",
    image: PR11,
    githubUrl: "https://github.com/mohamedsahadm786/Fine_tuning",
    technologies: ["PyTorch", "Hugging Face Transformers", "scikit-learn" , "MoviePy", "VideoMAE", "WavLM"]
  },
    {
    id: 1,
    title: "Banking Risk Analytics and Client Segmentation Dashboard",
    description: "Engineered and analyzed a comprehensive banking risk analytics dataset of 3,000+ clients, leveraging feature engineering (Engagement Timeframe, Income Bands, Processing Fees) and advanced exploratory data analysis using Python (pandas, seaborn, numpy), to quantify relationships across deposits, loans, credit card balances, and business lending—uncovering 0.84+ strong correlations and segmenting clients for targeted lending strategies. Developed and deployed a multi-tab Power BI dashboard integrating 10+ key banking sector metrics (Total Clients, Business Lending, Loan Amount, Deposits, Fees), delivered actionable risk segmentation and interactive drill-through insights, empowering banking decision makers to optimize loan approvals and minimize default risk while boosting client acquisition and operational efficiency, validated by distinct counts, KPIs, and segmented visual analysis.",
    image: PR12,
    githubUrl: "https://github.com/mohamedsahadm786/-risk-analytics-in-banking",
    technologies: ["Python", "numpy" , "pandas" , "seaborn" , "Power BI", "matplotlib "]
  },
    {
    id: 1,
    title: "Customer Shopping Behavior Analysis | Python, SQL, Power BI",
    description: "Solved a real-world retail analytics problem by cleaning and transforming 3,900+ customer transactions using Python (Pandas, NumPy) and SQL, uncovering purchase trends across demographics, categories, and seasons that improved decision-making accuracy by 25%. Developed an interactive Power BI dashboard integrating key KPIs such as revenue by age group, subscription impact, and discount dependency — enabling data-driven marketing and loyalty strategies that could boost retention and average order value by 15–20%.",
    image: PR13,
    githubUrl: "https://github.com/mohamedsahadm786/retail-analytics-python-sql-powerbi",
    technologies: ["Python", "SQL", "PostgreSQL", "Power BI","Pandas,EDA"]
  },
  {
    id: 1,
    title: "Amazon Data Analytics",
    description: "Analyzed over 29,000 Amazon purchasing records using complex SQL queries to derive key business insights. Implemented PL/pgSQL stored procedures to automate inventory updates, eliminating manual processes. Optimized queries using indexing and CTEs, improving performance by 30% and enhancing data retrieval efficiency.",
    image: PR1,
    githubUrl: "https://github.com/mohamedsahadm786/advanced-postgresql-business-insights",
    technologies: ["PostgreSQL", "SQL", "Data Analysis", "Business Intelligence"]
  },
     {
    id: 1,
    title: "Credit Risk Analysis",
    description: "Developed and deployed a machine learning–based credit risk classifier using Python, scikit-learn, and Streamlit that analyzed 1,000+ loan applications, improving default-risk prediction accuracy by 23% and enabling faster, data-driven credit approval decisions. Engineered an end-to-end analytics pipeline (EDA → Feature Engineering → Model Training → Deployment) and built an interactive web app for real-time scoring of applicants, reducing manual underwriting time by 70% and supporting risk-free lending strategies for financial institutions.",
    image: PR14,
    githubUrl: "https://github.com/mohamedsahadm786/credit-risk-analysis",
    technologies: ["Python", "Business Impact Analysis","Risk Classification & Scoring", "scikit-learn (sklearn)"]
  },
    {
    id: 5,
    title: "AI Sustainability Report Analyzer",
    description: "Developed an AI-powered pipeline to analyze 1000+ page multilingual sustainability reports, identifying digitalization needs using GPT-4o-mini with 95%+ accuracy. Automated PDF parsing, OCR, and section-wise text processing with PyMuPDF, Tesseract, and spaCy. Mapped insights to external service portfolios via dynamic web scraping, reducing manual effort by ~80% and enabling scalable ESG analysis.",
    image: PR5,
    githubUrl: "https://github.com/mohamedsahadm786/AI-powered-LLM-Sustainability-Report-Analyzer",
    technologies: ["GPT-4", "NLP", "OCR", "Web Scraping", "ESG Analysis"]
  },
    {
    id: 7,
    title: "AI Resume Generator",
    description: "Developed an AI-powered tool to generate job-specific, ATS-friendly resumes and cover letters within seconds. Utilized GPT-4o, NLP, and LaTeX automation to tailor content based on job descriptions. Built with Streamlit for a clean, one-click web interface to simplify job application processes.",
    image: PR7,
    githubUrl: "https://github.com/mohamedsahadm786/AI-Powered-ATS-Optimized-Resume-and-Cover-Letter-Generator",
    technologies: ["GPT-4", "Streamlit", "LaTeX", "NLP", "ATS Optimization"]
  },
    {
    id: 1,
    title: "FinBot– RAG-Based Financial Research Chatbot",
    description: "Developed FINBOT, an AI-driven Retrieval-Augmented Generation (RAG) chatbot leveraging LangChain, OpenAI, and FAISS, automating financial news extraction and summarization — processed approx 10K words per session from multi-source web inputs, delivering high-context, source-cited answers ( 92% accuracy) verified through manual testing.  Optimized semantic search and embedding pipeline to reduce manual research time by 75%, achieving sub-3 second query responses on financial datasets by integrating FAISS vector indexing, OpenAI embeddings, and Streamlit-based interactive retrieval interface.",
    image: PR15,
    githubUrl: "https://github.com/mohamedsahadm786/FinBot_RAG",
    technologies: ["PPython", "FAISS", "LangChain", "Tiktoken", "Unstructured]"]
  },
  {
    id: 2,
    title: "AI Sentiment Analysis Chatbot",
    description: "Developed an AI-powered chatbot leveraging deep learning and NLP to classify user sentiments with 86.3% accuracy. Built using LSTM neural networks in Python, the chatbot processes text inputs and provides real-time sentiment-based responses, improving user interaction and engagement.",
    image: PR2,
    githubUrl: "https://github.com/mohamedsahadm786/Sentiment-Analysis-Chatbot",
    technologies: ["Python", "LSTM", "NLP", "Deep Learning", "TensorFlow"]
  },
  {
    id: 3,
    title: "Real Estate Price Prediction",
    description: "Designed a predictive modeling tool for Bangalore's real estate market using machine learning techniques such as Random Forest and Gradient Boosting. Integrated a Flask-based UI to provide stakeholders with data-driven insights, enabling more informed property investment decisions.",
    image: PR3,
    githubUrl: "https://github.com/mohamedsahadm786/Real-Estate-Price-Prediction-AI-Powered-Tool-for-Bangalore-Housing-Market-",
    technologies: ["Python", "Machine Learning", "Flask", "Random Forest", "Gradient Boosting"]
  },
  {
    id: 4,
    title: "Cricket T20 Analytics",
    description: "Conducted performance analytics on T20 World Cup 2022 data, scraping and processing over 10,000 data points. Used Python and Power BI to visualize player performance metrics, helping identify top-performing players and optimize Best XI team selection based on statistical insights.",
    image: PR4,
    githubUrl: "https://github.com/mohamedsahadm786/Cricket-T20-World-Cup-2022-Data-Analysis",
    technologies: ["Python", "Power BI", "Data Scraping", "Sports Analytics", "Visualization"]
  },
  {
    id: 6,
    title: "Food Delivery Time Prediction",
    description: "Built a predictive model to estimate food delivery times using the Zomato Delivery dataset. Applied Random Forest and XGBoost with R² > 0.90. Performed feature engineering and hyperparameter tuning to improve accuracy, helping optimize delivery logistics and customer satisfaction.",
    image: PR6,
    githubUrl: "https://github.com/mohamedsahadm786/food-delivery-time-prediction",
    technologies: ["Python", "XGBoost", "Random Forest", "Feature Engineering", "Logistics"]
  },
  {
    id: 9,
    title: "N8N Automation Suite",
    description: "Built four custom automations using the n8n no-code platform: a Prompt-to-Photo Editor for quick image edits, an Image-to-Video Creator that transforms photos into short videos, a Multimodal Telegram Assistant supporting text, audio, video, and document inputs, and a RAG-powered Cover Letter Builder that generates tailored applications from job details and user background.",
    image: PR9,
    githubUrl: "https://github.com/mohamedsahadm786/N8N_Automation",
    technologies: ["n8n", "Automation", "Image Processing", "Video Creation", "RAG", "Telegram Bot"]
  }
];

const cardVariant = {
  hidden:  { opacity: 0, rotateY: 15, y: 30 },
  visible: (i: number) => ({
    opacity: 1, rotateY: 0, y: 0,
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};

export default function Projects() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleExpanded = (idx: number) => {
    setExpanded(expanded === idx ? null : idx);
  };

  const scrollToExperience = () => {
    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="projects"
      className="py-20 lg:py-32 section-glass"
      aria-label="Projects section"
      style={{ perspective: '1200px' }}
    >
      <div className="max-w-7xl mx-auto px-6">

        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold font-mono text-foreground mb-2"
            data-testid="projects-title"
          >
            <span className="text-primary">&gt;_</span> PROJECTS
          </h2>
          <div className="h-px w-24 mx-auto mt-4 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              custom={idx % 9}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={cardVariant}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Card
                className="group glass-neon border-0 overflow-hidden hover:scale-[1.03] transition-all duration-300 h-full flex flex-col"
                data-testid={`project-card-${project.id}`}
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={`${project.title} project thumbnail`}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Neon border on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: 'inset 0 0 0 2px var(--neon-cyan, #00d4ff)' }}
                  />
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold font-mono text-primary line-clamp-2">
                    {project.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 flex flex-col flex-1">
                  <p className={`text-sm text-muted-foreground leading-relaxed mb-2 ${expanded === idx ? '' : 'line-clamp-4'}`}>
                    {project.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(idx)}
                    className="p-0 h-auto mb-3 text-primary hover:text-primary/80 font-mono text-xs self-start"
                  >
                    {expanded === idx ? (
                      <>Show Less <ChevronUp className="w-3 h-3 ml-1" /></>
                    ) : (
                      <>Show More <ChevronDown className="w-3 h-3 ml-1" /></>
                    )}
                  </Button>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-xs font-mono px-2 py-0.5"
                      >
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs font-mono border-primary/40 text-primary/70">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="mt-auto">
                    <Button
                      onClick={() => window.open(project.githubUrl, '_blank')}
                      className="w-full font-mono text-xs group/btn"
                      style={{ boxShadow: '0 0 12px rgba(0,212,255,0.15)' }}
                      data-testid={`project-source-${project.id}`}
                    >
                      <Github className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
                      SOURCE CODE
                      <ExternalLink className="w-3 h-3 ml-2 opacity-70" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Button
            size="lg"
            onClick={scrollToExperience}
            className="font-mono px-8 py-3 text-base font-semibold"
            style={{ boxShadow: '0 0 16px rgba(0,212,255,0.2)' }}
            data-testid="projects-cta"
          >
            Oh, now I've got your attention! Time to dive into my work experience! 😎
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
