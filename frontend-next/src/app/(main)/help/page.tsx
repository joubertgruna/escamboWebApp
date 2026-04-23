"use client";

import { useState } from "react";
import { ChevronDown, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import api from "@/lib/api";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "Como funciona o processo de troca?",
    answer: "1. Navegue pelo feed\n2. Encontre um item que queira\n3. Clique em 'Trocar'\n4. Aguarde match\n5. Combine com o usuário\n6. Realize a troca!",
  },
  {
    id: 2,
    question: "Como adicionar um item?",
    answer: "Clique no botão '+' na barra inferior > Preencha os dados > Envie fotos > Pronto!",
  },
  {
    id: 3,
    question: "É seguro usar a plataforma?",
    answer: "Sim! Todos os usuários são verificados e as trocas são mediadas pela plataforma.",
  },
  {
    id: 4,
    question: "Como faço para não receber mais um item no feed?",
    answer: "Clique nos 3 pontinhos do item > Selecione 'Não interessado' > Esse item não aparecerá mais para você.",
  },
];

export default function HelpPage() {
  const { success, error } = useToast();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendContact = async () => {
    if (!contactEmail || !contactMessage) {
      error("Preencha todos os campos");
      return;
    }

    setSending(true);
    try {
      await api.post("/help/contact", { email: contactEmail, message: contactMessage });
      setContactEmail("");
      setContactMessage("");
      success("Mensagem enviada com sucesso!");
    } catch (err) {
      error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-escambo-light pb-20">
      <Header showLogo showNotifications showBack />

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* FAQ Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <div className="space-y-3">
            {FAQ_DATA.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === item.id ? null : item.id)
                  }
                  className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 text-left">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ml-2 ${
                      expandedFAQ === item.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFAQ === item.id && (
                  <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 text-sm whitespace-pre-line">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <div className="bg-white rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-escambo-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  support@escambo.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
              <MessageCircle className="w-5 h-5 text-escambo-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  +55 85 9 9999-9999
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-4">
              <Input
                label="Seu Email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="seu@email.com"
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Descreva seu problema..."
                  className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl focus:border-escambo-primary focus:ring-2 focus:ring-escambo-primary/10 resize-none"
                  rows={5}
                />
              </div>
              <Button
                fullWidth
                onClick={handleSendContact}
                loading={sending}
              >
                Enviar Mensagem
              </Button>
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Links Úteis</h2>
          <div className="space-y-2">
            <Button
              fullWidth
              variant="outline"
              className="justify-start"
              onClick={() => window.open("#")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Política de Privacidade
            </Button>
            <Button
              fullWidth
              variant="outline"
              className="justify-start"
              onClick={() => window.open("#")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Termos de Uso
            </Button>
            <Button
              fullWidth
              variant="outline"
              className="justify-start"
              onClick={() => window.open("#")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Status da Plataforma
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
