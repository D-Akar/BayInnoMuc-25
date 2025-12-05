// Multilingual FAQ Service - Provides FAQs based on locale

export interface FAQItem {
  id: string;
  category: string;
  categoryKey: string;
  question: string;
  answer: string;
  tags: string[];
}

type Locale = 'en' | 'de' | 'uk' | 'fr' | 'tr';

const faqDataByLocale: Record<Locale, FAQItem[]> = {
  en: [
    {
      id: "1",
      category: "Testing & Diagnosis",
      categoryKey: "testing",
      question: "What should I do if I think I've been exposed to HIV?",
      answer: "If you believe you may have been exposed to HIV, it's important to act quickly. Post-exposure prophylaxis (PEP) is a medication that can prevent HIV infection if started within 72 hours of exposure. Contact a healthcare provider, local clinic, or emergency room immediately. We understand this can be frightening, and you're not alone. Many people have navigated this situation, and there are resources available to help you.",
      tags: ["exposure", "PEP", "emergency", "testing"],
    },
    {
      id: "2",
      category: "Testing & Diagnosis",
      categoryKey: "testing",
      question: "How accurate are HIV tests?",
      answer: "Modern HIV tests are highly accurate. Fourth-generation tests can detect HIV as early as 2-4 weeks after exposure with over 99% accuracy. If you test negative after the window period (typically 3 months), the result is considered conclusive. However, if you've had recent exposure, it's important to test again after the window period. We're here to help you understand your results and next steps.",
      tags: ["testing", "accuracy", "window period", "diagnosis"],
    },
    {
      id: "3",
      category: "Testing & Diagnosis",
      categoryKey: "testing",
      question: "Where can I get tested confidentially?",
      answer: "You can get tested at many locations, including local health departments, community health centers, private doctors' offices, and some pharmacies. Many locations offer free or low-cost testing, and your results are confidential. Some places offer rapid testing with results in 20 minutes. We can help you find testing locations in your area that respect your privacy and provide supportive care.",
      tags: ["testing", "confidential", "locations", "privacy"],
    },
    {
      id: "4",
      category: "Prevention & PrEP",
      categoryKey: "prevention",
      question: "What is PrEP and should I consider it?",
      answer: "PrEP (Pre-Exposure Prophylaxis) is a daily medication that can significantly reduce your risk of getting HIV through sex or injection drug use. When taken consistently, PrEP is up to 99% effective at preventing HIV. It's recommended for people who are at higher risk of HIV exposure. Talking with a healthcare provider can help you determine if PrEP is right for you. There's no judgment here—taking care of your health is important, and PrEP is a valid prevention option.",
      tags: ["PrEP", "prevention", "medication", "protection"],
    },
    {
      id: "5",
      category: "Treatment & Medication",
      categoryKey: "treatment",
      question: "What are the side effects of HIV medication?",
      answer: "Modern HIV medications are generally well-tolerated, and many people experience few or no side effects. When side effects do occur, they're often mild and temporary, such as nausea, fatigue, or headaches during the first few weeks. Serious side effects are rare. Your healthcare provider will work with you to find a medication regimen that works for your body. If you're experiencing side effects, it's important to communicate with your care team—they can help adjust your treatment.",
      tags: ["medication", "side effects", "treatment", "health"],
    },
    {
      id: "6",
      category: "Treatment & Medication",
      categoryKey: "treatment",
      question: "Is HIV treatment free or covered by insurance?",
      answer: "HIV treatment is often covered by insurance, including Medicaid and Medicare. There are also assistance programs available for those who are uninsured or underinsured, such as the Ryan White HIV/AIDS Program, pharmaceutical patient assistance programs, and state AIDS Drug Assistance Programs (ADAP). Many clinics offer sliding scale fees based on income. You don't have to navigate this alone—we can help connect you with resources to access the care you need.",
      tags: ["insurance", "cost", "financial assistance", "treatment"],
    },
    {
      id: "7",
      category: "Living with HIV",
      categoryKey: "living",
      question: "Can I live a normal life with HIV?",
      answer: "Yes, absolutely. With modern treatment, people living with HIV can live long, healthy, and fulfilling lives. Effective HIV medication (antiretroviral therapy) can reduce the amount of virus in your body to undetectable levels, which means you can't transmit HIV to others and can maintain good health. Many people with HIV work, have relationships, start families, and pursue their dreams. Your diagnosis doesn't define you, and there's a whole community of people living full, vibrant lives with HIV.",
      tags: ["living with HIV", "normal life", "health", "hope"],
    },
    {
      id: "8",
      category: "Living with HIV",
      categoryKey: "living",
      question: "How do I tell my partner about my status?",
      answer: "Disclosing your HIV status to a partner can feel overwhelming, and there's no one 'right' way to do it. Choose a private, comfortable setting when you both have time to talk. You might want to prepare what you'll say, and remember that you're sharing important health information—you're not asking for forgiveness. If you're on effective treatment and undetectable, you can share that you can't transmit HIV. Some people find it helpful to bring educational materials. Remember, you deserve respect and support. If you need help preparing for this conversation, we're here to support you.",
      tags: ["disclosure", "partner", "relationships", "communication"],
    },
    {
      id: "9",
      category: "Support Resources",
      categoryKey: "support",
      question: "Where can I find emotional support?",
      answer: "You don't have to navigate this alone. There are many sources of support available, including support groups (both in-person and online), mental health counselors who specialize in HIV care, peer navigators, and crisis hotlines. Many organizations offer free or low-cost counseling services. Connecting with others who understand your experience can be incredibly valuable. We're here to help you find the support that feels right for you.",
      tags: ["support", "emotional", "counseling", "community"],
    },
    {
      id: "10",
      category: "Support Resources",
      categoryKey: "support",
      question: "What legal protections exist for people living with HIV?",
      answer: "People living with HIV are protected by the Americans with Disabilities Act (ADA), which prohibits discrimination in employment, housing, and public accommodations. Your HIV status is confidential medical information, and healthcare providers are required to protect your privacy under HIPAA. Laws vary by state regarding disclosure requirements to sexual partners. If you're facing discrimination or have questions about your rights, legal aid organizations can provide guidance and support.",
      tags: ["legal", "rights", "discrimination", "privacy"],
    },
    {
      id: "11",
      category: "Prevention & PrEP",
      categoryKey: "prevention",
      question: "How do I start PrEP?",
      answer: "Starting PrEP involves a few steps: first, you'll need to see a healthcare provider who can prescribe it. They'll test you for HIV (to confirm you're negative) and check your kidney function. If PrEP is right for you, they'll write a prescription. Many insurance plans cover PrEP, and there are assistance programs if cost is a concern. Once you start, you'll take one pill daily. Your provider will want to see you every few months for follow-up testing and to ensure everything is going well. Taking this step to protect your health is something to be proud of.",
      tags: ["PrEP", "starting", "prescription", "healthcare"],
    },
    {
      id: "12",
      category: "Living with HIV",
      categoryKey: "living",
      question: "Can I have children if I'm living with HIV?",
      answer: "Yes, people living with HIV can have healthy children. With proper medical care and treatment, the risk of transmitting HIV to your baby during pregnancy or childbirth is less than 1%. This involves taking HIV medication during pregnancy, potentially adjusting your treatment plan, and sometimes using formula instead of breastfeeding (depending on your situation and location). Many people living with HIV have become parents and have healthy, HIV-negative children. If you're considering starting a family, talking with an HIV specialist who has experience with pregnancy care is important.",
      tags: ["pregnancy", "children", "family", "transmission"],
    },
  ],
  de: [
    {
      id: "1",
      category: "Tests & Diagnose",
      categoryKey: "testing",
      question: "Was soll ich tun, wenn ich glaube, dass ich HIV ausgesetzt war?",
      answer: "Wenn Sie glauben, dass Sie möglicherweise HIV ausgesetzt waren, ist es wichtig, schnell zu handeln. Die Post-Expositions-Prophylaxe (PEP) ist ein Medikament, das eine HIV-Infektion verhindern kann, wenn es innerhalb von 72 Stunden nach der Exposition begonnen wird. Wenden Sie sich sofort an einen Gesundheitsdienstleister, eine örtliche Klinik oder eine Notaufnahme. Wir verstehen, dass dies beängstigend sein kann, und Sie sind nicht allein. Viele Menschen haben diese Situation gemeistert, und es gibt Ressourcen, die Ihnen helfen können.",
      tags: ["Exposition", "PEP", "Notfall", "Tests"],
    },
    {
      id: "2",
      category: "Tests & Diagnose",
      categoryKey: "testing",
      question: "Wie genau sind HIV-Tests?",
      answer: "Moderne HIV-Tests sind sehr genau. Tests der vierten Generation können HIV bereits 2-4 Wochen nach der Exposition mit über 99% Genauigkeit nachweisen. Wenn Sie nach der Fensterperiode (typischerweise 3 Monate) negativ testen, wird das Ergebnis als schlüssig angesehen. Wenn Sie jedoch kürzlich exponiert waren, ist es wichtig, nach der Fensterperiode erneut zu testen. Wir sind hier, um Ihnen zu helfen, Ihre Ergebnisse und die nächsten Schritte zu verstehen.",
      tags: ["Tests", "Genauigkeit", "Fensterperiode", "Diagnose"],
    },
    {
      id: "3",
      category: "Tests & Diagnose",
      categoryKey: "testing",
      question: "Wo kann ich vertraulich getestet werden?",
      answer: "Sie können sich an vielen Orten testen lassen, einschließlich örtlicher Gesundheitsämter, Gemeindegesundheitszentren, privaten Arztpraxen und einigen Apotheken. Viele Orte bieten kostenlose oder kostengünstige Tests an, und Ihre Ergebnisse sind vertraulich. Einige Orte bieten Schnelltests mit Ergebnissen in 20 Minuten an. Wir können Ihnen helfen, Teststandorte in Ihrer Nähe zu finden, die Ihre Privatsphäre respektieren und unterstützende Betreuung bieten.",
      tags: ["Tests", "vertraulich", "Standorte", "Privatsphäre"],
    },
    {
      id: "4",
      category: "Prävention & PrEP",
      categoryKey: "prevention",
      question: "Was ist PrEP und sollte ich es in Betracht ziehen?",
      answer: "PrEP (Prä-Expositions-Prophylaxe) ist ein tägliches Medikament, das Ihr Risiko, sich durch Sex oder injizierenden Drogenkonsum mit HIV zu infizieren, erheblich reduzieren kann. Bei konsequenter Einnahme ist PrEP bis zu 99% wirksam bei der Prävention von HIV. Es wird für Menschen empfohlen, die einem höheren HIV-Expositionsrisiko ausgesetzt sind. Ein Gespräch mit einem Gesundheitsdienstleister kann Ihnen helfen zu bestimmen, ob PrEP für Sie richtig ist. Es gibt hier kein Urteil—die Pflege Ihrer Gesundheit ist wichtig, und PrEP ist eine gültige Präventionsoption.",
      tags: ["PrEP", "Prävention", "Medikament", "Schutz"],
    },
    {
      id: "5",
      category: "Behandlung & Medikamente",
      categoryKey: "treatment",
      question: "Was sind die Nebenwirkungen von HIV-Medikamenten?",
      answer: "Moderne HIV-Medikamente werden im Allgemeinen gut vertragen, und viele Menschen haben wenige oder keine Nebenwirkungen. Wenn Nebenwirkungen auftreten, sind sie oft mild und vorübergehend, wie Übelkeit, Müdigkeit oder Kopfschmerzen in den ersten Wochen. Schwere Nebenwirkungen sind selten. Ihr Gesundheitsdienstleister wird mit Ihnen zusammenarbeiten, um ein Medikamentenschema zu finden, das für Ihren Körper funktioniert. Wenn Sie Nebenwirkungen haben, ist es wichtig, mit Ihrem Betreuungsteam zu kommunizieren—sie können helfen, Ihre Behandlung anzupassen.",
      tags: ["Medikament", "Nebenwirkungen", "Behandlung", "Gesundheit"],
    },
    {
      id: "6",
      category: "Behandlung & Medikamente",
      categoryKey: "treatment",
      question: "Ist die HIV-Behandlung kostenlos oder von der Versicherung abgedeckt?",
      answer: "Die HIV-Behandlung wird oft von Versicherungen abgedeckt, einschließlich Medicaid und Medicare. Es gibt auch Unterstützungsprogramme für Personen ohne Versicherung oder mit unzureichender Versicherung, wie das Ryan White HIV/AIDS-Programm, pharmazeutische Patientenunterstützungsprogramme und staatliche AIDS-Medikamentenunterstützungsprogramme (ADAP). Viele Kliniken bieten gestaffelte Gebühren basierend auf dem Einkommen an. Sie müssen dies nicht allein bewältigen—wir können Ihnen helfen, sich mit Ressourcen zu verbinden, um die benötigte Betreuung zu erhalten.",
      tags: ["Versicherung", "Kosten", "finanzielle Unterstützung", "Behandlung"],
    },
    {
      id: "7",
      category: "Leben mit HIV",
      categoryKey: "living",
      question: "Kann ich mit HIV ein normales Leben führen?",
      answer: "Ja, absolut. Mit moderner Behandlung können Menschen mit HIV lange, gesunde und erfüllte Leben führen. Wirksame HIV-Medikamente (antiretrovirale Therapie) können die Virusmenge in Ihrem Körper auf nicht nachweisbare Werte reduzieren, was bedeutet, dass Sie HIV nicht auf andere übertragen können und eine gute Gesundheit aufrechterhalten können. Viele Menschen mit HIV arbeiten, haben Beziehungen, gründen Familien und verfolgen ihre Träume. Ihre Diagnose definiert Sie nicht, und es gibt eine ganze Gemeinschaft von Menschen, die vollständige, lebendige Leben mit HIV führen.",
      tags: ["Leben mit HIV", "normales Leben", "Gesundheit", "Hoffnung"],
    },
    {
      id: "8",
      category: "Leben mit HIV",
      categoryKey: "living",
      question: "Wie sage ich meinem Partner von meinem Status?",
      answer: "Die Offenlegung Ihres HIV-Status gegenüber einem Partner kann überwältigend sein, und es gibt keinen einzigen 'richtigen' Weg, dies zu tun. Wählen Sie eine private, komfortable Umgebung, wenn Sie beide Zeit zum Reden haben. Sie möchten vielleicht vorbereiten, was Sie sagen werden, und denken Sie daran, dass Sie wichtige Gesundheitsinformationen teilen—Sie bitten nicht um Vergebung. Wenn Sie eine wirksame Behandlung haben und nicht nachweisbar sind, können Sie teilen, dass Sie HIV nicht übertragen können. Einige Menschen finden es hilfreich, Bildungsmaterialien mitzubringen. Denken Sie daran, Sie verdienen Respekt und Unterstützung. Wenn Sie Hilfe bei der Vorbereitung auf dieses Gespräch benötigen, sind wir hier, um Sie zu unterstützen.",
      tags: ["Offenlegung", "Partner", "Beziehungen", "Kommunikation"],
    },
    {
      id: "9",
      category: "Unterstützungsressourcen",
      categoryKey: "support",
      question: "Wo kann ich emotionale Unterstützung finden?",
      answer: "Sie müssen dies nicht allein bewältigen. Es gibt viele Unterstützungsquellen, einschließlich Selbsthilfegruppen (sowohl persönlich als auch online), psychiatrischen Beratern, die sich auf HIV-Betreuung spezialisiert haben, Peer-Navigatoren und Krisen-Hotlines. Viele Organisationen bieten kostenlose oder kostengünstige Beratungsdienste an. Die Verbindung mit anderen, die Ihre Erfahrung verstehen, kann unglaublich wertvoll sein. Wir sind hier, um Ihnen zu helfen, die Unterstützung zu finden, die sich für Sie richtig anfühlt.",
      tags: ["Unterstützung", "emotional", "Beratung", "Gemeinschaft"],
    },
    {
      id: "10",
      category: "Unterstützungsressourcen",
      categoryKey: "support",
      question: "Welche rechtlichen Schutzmaßnahmen gibt es für Menschen mit HIV?",
      answer: "Menschen mit HIV sind durch den Americans with Disabilities Act (ADA) geschützt, der Diskriminierung bei Beschäftigung, Wohnung und öffentlichen Unterkünften verbietet. Ihr HIV-Status ist vertrauliche medizinische Information, und Gesundheitsdienstleister sind verpflichtet, Ihre Privatsphäre unter HIPAA zu schützen. Die Gesetze variieren je nach Staat bezüglich der Offenlegungsanforderungen an Sexualpartner. Wenn Sie Diskriminierung erleben oder Fragen zu Ihren Rechten haben, können Rechtshilfeorganisationen Anleitung und Unterstützung bieten.",
      tags: ["rechtlich", "Rechte", "Diskriminierung", "Privatsphäre"],
    },
    {
      id: "11",
      category: "Prävention & PrEP",
      categoryKey: "prevention",
      question: "Wie beginne ich mit PrEP?",
      answer: "Der Beginn von PrEP umfasst einige Schritte: Zuerst müssen Sie einen Gesundheitsdienstleister aufsuchen, der es verschreiben kann. Sie werden Sie auf HIV testen (um zu bestätigen, dass Sie negativ sind) und Ihre Nierenfunktion überprüfen. Wenn PrEP für Sie richtig ist, werden sie ein Rezept ausstellen. Viele Versicherungspläne decken PrEP ab, und es gibt Unterstützungsprogramme, wenn die Kosten ein Problem sind. Sobald Sie beginnen, nehmen Sie täglich eine Pille ein. Ihr Anbieter möchte Sie alle paar Monate für Nachuntersuchungen sehen und sicherstellen, dass alles gut läuft. Dieser Schritt zum Schutz Ihrer Gesundheit ist etwas, auf das Sie stolz sein können.",
      tags: ["PrEP", "Beginn", "Rezept", "Gesundheitswesen"],
    },
    {
      id: "12",
      category: "Leben mit HIV",
      categoryKey: "living",
      question: "Kann ich Kinder haben, wenn ich mit HIV lebe?",
      answer: "Ja, Menschen mit HIV können gesunde Kinder haben. Mit angemessener medizinischer Betreuung und Behandlung liegt das Risiko, HIV während der Schwangerschaft oder Geburt auf Ihr Baby zu übertragen, bei weniger als 1%. Dies beinhaltet die Einnahme von HIV-Medikamenten während der Schwangerschaft, möglicherweise die Anpassung Ihres Behandlungsplans und manchmal die Verwendung von Formel anstelle des Stillens (abhängig von Ihrer Situation und Ihrem Standort). Viele Menschen mit HIV sind Eltern geworden und haben gesunde, HIV-negative Kinder. Wenn Sie erwägen, eine Familie zu gründen, ist es wichtig, mit einem HIV-Spezialisten zu sprechen, der Erfahrung mit Schwangerschaftsbetreuung hat.",
      tags: ["Schwangerschaft", "Kinder", "Familie", "Übertragung"],
    },
  ],
  uk: [
    {
      id: "1",
      category: "Тестування та діагностика",
      categoryKey: "testing",
      question: "Що мені робити, якщо я думаю, що я піддався ВІЛ?",
      answer: "Якщо ви вважаєте, що могли піддатися ВІЛ, важливо діяти швидко. Постекспозиційна профілактика (PEP) — це ліки, які можуть запобігти інфікуванню ВІЛ, якщо їх почати приймати протягом 72 годин після контакту. Негайно зверніться до медичного працівника, місцевої клініки або відділення невідкладної допомоги. Ми розуміємо, що це може бути страшно, і ви не самі. Багато людей пройшли через цю ситуацію, і є ресурси, які можуть вам допомогти.",
      tags: ["експозиція", "PEP", "надзвичайна ситуація", "тестування"],
    },
    {
      id: "2",
      category: "Тестування та діагностика",
      categoryKey: "testing",
      question: "Наскільки точні тести на ВІЛ?",
      answer: "Сучасні тести на ВІЛ дуже точні. Тести четвертого покоління можуть виявити ВІЛ вже через 2-4 тижні після контакту з точністю понад 99%. Якщо ви отримали негативний результат після вікна періоду (зазвичай 3 місяці), результат вважається остаточним. Однак, якщо у вас був недавній контакт, важливо пройти тестування знову після вікна періоду. Ми тут, щоб допомогти вам зрозуміти ваші результати та наступні кроки.",
      tags: ["тестування", "точність", "вікно періоду", "діагностика"],
    },
    {
      id: "3",
      category: "Тестування та діагностика",
      categoryKey: "testing",
      question: "Де я можу пройти тестування конфіденційно?",
      answer: "Ви можете пройти тестування в багатьох місцях, включаючи місцеві відділи охорони здоров'я, центри громадського здоров'я, приватні лікарні та деякі аптеки. Багато місць пропонують безкоштовне або недороге тестування, і ваші результати є конфіденційними. Деякі місця пропонують швидке тестування з результатами за 20 хвилин. Ми можемо допомогти вам знайти місця тестування у вашому районі, які поважають вашу конфіденційність і надають підтримуючий догляд.",
      tags: ["тестування", "конфіденційно", "місця", "приватність"],
    },
    {
      id: "4",
      category: "Профілактика та PrEP",
      categoryKey: "prevention",
      question: "Що таке PrEP і чи варто мені його розглянути?",
      answer: "PrEP (Доекспозиційна профілактика) — це щоденний ліки, який може значно зменшити ваш ризик зараження ВІЛ через секс або ін'єкційне вживання наркотиків. При послідовному прийомі PrEP ефективний до 99% у запобіганні ВІЛ. Він рекомендується для людей, які мають вищий ризик контакту з ВІЛ. Розмова з медичним працівником може допомогти вам визначити, чи підходить вам PrEP. Тут немає осуду—турбота про ваше здоров'я важлива, і PrEP є валідною опцією профілактики.",
      tags: ["PrEP", "профілактика", "ліки", "захист"],
    },
    {
      id: "5",
      category: "Лікування та медикаменти",
      categoryKey: "treatment",
      question: "Які побічні ефекти мають ліки від ВІЛ?",
      answer: "Сучасні ліки від ВІЛ зазвичай добре переносяться, і багато людей мають мало або взагалі не мають побічних ефектів. Коли побічні ефекти все ж таки виникають, вони часто є легкими та тимчасовими, такими як нудота, втома або головний біль протягом перших кількох тижнів. Серйозні побічні ефекти рідкісні. Ваш медичний працівник працюватиме з вами, щоб знайти схему лікування, яка підходить вашому організму. Якщо ви відчуваєте побічні ефекти, важливо спілкуватися з вашою командою догляду—вони можуть допомогти скоригувати ваше лікування.",
      tags: ["ліки", "побічні ефекти", "лікування", "здоров'я"],
    },
    {
      id: "6",
      category: "Лікування та медикаменти",
      categoryKey: "treatment",
      question: "Чи безкоштовне лікування ВІЛ або воно покривається страхуванням?",
      answer: "Лікування ВІЛ часто покривається страхуванням, включаючи Medicaid та Medicare. Також є програми допомоги для тих, хто не має страхування або має недостатнє страхування, такі як Програма Райана Вайта з ВІЛ/СНІД, фармацевтичні програми допомоги пацієнтам та державні програми допомоги з ліками від СНІДу (ADAP). Багато клінік пропонують плаваючі тарифи на основі доходу. Вам не потрібно проходити це самостійно—ми можемо допомогти вам зв'язатися з ресурсами для отримання необхідного догляду.",
      tags: ["страхування", "вартість", "фінансова допомога", "лікування"],
    },
    {
      id: "7",
      category: "Життя з ВІЛ",
      categoryKey: "living",
      question: "Чи можу я жити нормальним життям з ВІЛ?",
      answer: "Так, абсолютно. За сучасного лікування люди з ВІЛ можуть жити довгим, здоровим і повноцінним життям. Ефективні ліки від ВІЛ (антиретровірусна терапія) можуть зменшити кількість вірусу в вашому організмі до невиявлених рівнів, що означає, що ви не можете передавати ВІЛ іншим і можете підтримувати хороше здоров'я. Багато людей з ВІЛ працюють, мають стосунки, засновують сім'ї та реалізують свої мрії. Ваш діагноз не визначає вас, і є ціла спільнота людей, які живуть повним, яскравим життям з ВІЛ.",
      tags: ["життя з ВІЛ", "нормальне життя", "здоров'я", "надія"],
    },
    {
      id: "8",
      category: "Життя з ВІЛ",
      categoryKey: "living",
      question: "Як мені розповісти партнеру про мій статус?",
      answer: "Розкриття вашого ВІЛ-статусу партнеру може здаватися переважним, і немає єдиного 'правильного' способу це зробити. Виберіть приватне, комфортне місце, коли у вас обох є час поговорити. Ви можете захотіти підготувати те, що скажете, і пам'ятайте, що ви ділитеся важливою інформацією про здоров'я—ви не просите прощення. Якщо ви на ефективному лікуванні та невиявлені, ви можете поділитися тим, що не можете передавати ВІЛ. Деяким людям корисно принести навчальні матеріали. Пам'ятайте, ви заслуговуєте на повагу та підтримку. Якщо вам потрібна допомога в підготовці до цієї розмови, ми тут, щоб підтримати вас.",
      tags: ["розкриття", "партнер", "стосунки", "спілкування"],
    },
    {
      id: "9",
      category: "Ресурси підтримки",
      categoryKey: "support",
      question: "Де я можу знайти емоційну підтримку?",
      answer: "Вам не потрібно проходити це самостійно. Є багато джерел підтримки, включаючи групи підтримки (як особисто, так і онлайн), психіатричних консультантів, які спеціалізуються на догляді за ВІЛ, навігаторів-однолітків та кризові гарячі лінії. Багато організацій пропонують безкоштовні або недорогі консультаційні послуги. Зв'язок з іншими, хто розуміє ваш досвід, може бути неймовірно цінним. Ми тут, щоб допомогти вам знайти підтримку, яка відчувається правильною для вас.",
      tags: ["підтримка", "емоційна", "консультування", "спільнота"],
    },
    {
      id: "10",
      category: "Ресурси підтримки",
      categoryKey: "support",
      question: "Які правові захисти існують для людей з ВІЛ?",
      answer: "Люди з ВІЛ захищені Законом про американців з інвалідністю (ADA), який забороняє дискримінацію в зайнятості, житлі та громадських приміщеннях. Ваш ВІЛ-статус є конфіденційною медичною інформацією, і медичні працівники зобов'язані захищати вашу приватність згідно з HIPAA. Закони різняться за штатами щодо вимог розкриття сексуальним партнерам. Якщо ви стикаєтеся з дискримінацією або маєте питання про ваші права, організації правової допомоги можуть надати керівництво та підтримку.",
      tags: ["правовий", "права", "дискримінація", "приватність"],
    },
    {
      id: "11",
      category: "Профілактика та PrEP",
      categoryKey: "prevention",
      question: "Як мені почати PrEP?",
      answer: "Початок PrEP включає кілька кроків: спочатку вам потрібно побачити медичного працівника, який може його призначити. Вони протестують вас на ВІЛ (щоб підтвердити, що ви негативні) та перевірять вашу функцію нирок. Якщо PrEP підходить вам, вони випишуть рецепт. Багато страхових планів покривають PrEP, і є програми допомоги, якщо вартість є проблемою. Як тільки ви почнете, ви будете приймати одну таблетку щодня. Ваш провайдер захоче бачити вас кожні кілька місяців для повторного тестування та переконання, що все йде добре. Цей крок для захисту вашого здоров'я — це те, чим можна пишатися.",
      tags: ["PrEP", "початок", "рецепт", "охорона здоров'я"],
    },
    {
      id: "12",
      category: "Життя з ВІЛ",
      categoryKey: "living",
      question: "Чи можу я мати дітей, якщо я живу з ВІЛ?",
      answer: "Так, люди з ВІЛ можуть мати здорових дітей. За належної медичної допомоги та лікування ризик передачі ВІЛ вашій дитині під час вагітності або пологів становить менше 1%. Це включає прийом ліків від ВІЛ під час вагітності, можливе коригування вашого плану лікування та іноді використання суміші замість грудного вигодовування (залежно від вашої ситуації та місця). Багато людей з ВІЛ стали батьками і мають здорових, ВІЛ-негативних дітей. Якщо ви розглядаєте можливість створення сім'ї, важливо поговорити зі спеціалістом з ВІЛ, який має досвід догляду за вагітністю.",
      tags: ["вагітність", "діти", "сім'я", "передача"],
    },
  ],
  fr: [
    {
      id: "1",
      category: "Tests et Diagnostic",
      categoryKey: "testing",
      question: "Que dois-je faire si je pense avoir été exposé au VIH ?",
      answer: "Si vous pensez avoir été exposé au VIH, il est important d'agir rapidement. La prophylaxie post-exposition (PEP) est un médicament qui peut prévenir l'infection par le VIH s'il est commencé dans les 72 heures suivant l'exposition. Contactez immédiatement un professionnel de la santé, une clinique locale ou un service d'urgence. Nous comprenons que cela peut être effrayant, et vous n'êtes pas seul. Beaucoup de gens ont vécu cette situation, et il existe des ressources disponibles pour vous aider.",
      tags: ["exposition", "PEP", "urgence", "tests"],
    },
    {
      id: "2",
      category: "Tests et Diagnostic",
      categoryKey: "testing",
      question: "Quelle est la précision des tests de dépistage du VIH ?",
      answer: "Les tests modernes de dépistage du VIH sont très précis. Les tests de quatrième génération peuvent détecter le VIH dès 2 à 4 semaines après l'exposition avec une précision de plus de 99%. Si vous testez négatif après la période fenêtre (généralement 3 mois), le résultat est considéré comme concluant. Cependant, si vous avez eu une exposition récente, il est important de refaire un test après la période fenêtre. Nous sommes là pour vous aider à comprendre vos résultats et les prochaines étapes.",
      tags: ["tests", "précision", "période fenêtre", "diagnostic"],
    },
    {
      id: "3",
      category: "Tests et Diagnostic",
      categoryKey: "testing",
      question: "Où puis-je me faire tester de manière confidentielle ?",
      answer: "Vous pouvez vous faire tester dans de nombreux endroits, notamment les services de santé locaux, les centres de santé communautaires, les cabinets de médecins privés et certaines pharmacies. De nombreux endroits offrent des tests gratuits ou à faible coût, et vos résultats sont confidentiels. Certains endroits offrent des tests rapides avec des résultats en 20 minutes. Nous pouvons vous aider à trouver des lieux de dépistage dans votre région qui respectent votre vie privée et offrent des soins de soutien.",
      tags: ["tests", "confidentiel", "lieux", "vie privée"],
    },
    {
      id: "4",
      category: "Prévention et PrEP",
      categoryKey: "prevention",
      question: "Qu'est-ce que la PrEP et devrais-je l'envisager ?",
      answer: "La PrEP (Prophylaxie Pré-Exposition) est un médicament quotidien qui peut considérablement réduire votre risque de contracter le VIH par le sexe ou l'utilisation de drogues injectables. Lorsqu'elle est prise de manière cohérente, la PrEP est efficace jusqu'à 99% pour prévenir le VIH. Elle est recommandée pour les personnes qui présentent un risque plus élevé d'exposition au VIH. Parler avec un professionnel de la santé peut vous aider à déterminer si la PrEP vous convient. Il n'y a aucun jugement ici—prendre soin de votre santé est important, et la PrEP est une option de prévention valide.",
      tags: ["PrEP", "prévention", "médicament", "protection"],
    },
    {
      id: "5",
      category: "Traitement et Médicaments",
      categoryKey: "treatment",
      question: "Quels sont les effets secondaires des médicaments contre le VIH ?",
      answer: "Les médicaments modernes contre le VIH sont généralement bien tolérés, et beaucoup de gens éprouvent peu ou pas d'effets secondaires. Lorsque des effets secondaires se produisent, ils sont souvent légers et temporaires, comme des nausées, de la fatigue ou des maux de tête pendant les premières semaines. Les effets secondaires graves sont rares. Votre professionnel de la santé travaillera avec vous pour trouver un régime médicamenteux qui fonctionne pour votre corps. Si vous ressentez des effets secondaires, il est important de communiquer avec votre équipe de soins—ils peuvent aider à ajuster votre traitement.",
      tags: ["médicament", "effets secondaires", "traitement", "santé"],
    },
    {
      id: "6",
      category: "Traitement et Médicaments",
      categoryKey: "treatment",
      question: "Le traitement du VIH est-il gratuit ou couvert par l'assurance ?",
      answer: "Le traitement du VIH est souvent couvert par l'assurance, y compris Medicaid et Medicare. Il existe également des programmes d'assistance disponibles pour ceux qui n'ont pas d'assurance ou qui sont sous-assurés, comme le Programme Ryan White VIH/SIDA, les programmes d'assistance aux patients pharmaceutiques et les programmes d'assistance aux médicaments contre le SIDA de l'État (ADAP). De nombreuses cliniques offrent des frais à échelle mobile basés sur le revenu. Vous n'avez pas à naviguer cela seul—nous pouvons vous aider à vous connecter avec des ressources pour accéder aux soins dont vous avez besoin.",
      tags: ["assurance", "coût", "aide financière", "traitement"],
    },
    {
      id: "7",
      category: "Vivre avec le VIH",
      categoryKey: "living",
      question: "Puis-je vivre une vie normale avec le VIH ?",
      answer: "Oui, absolument. Avec un traitement moderne, les personnes vivant avec le VIH peuvent vivre longtemps, en bonne santé et de manière épanouie. Les médicaments efficaces contre le VIH (thérapie antirétrovirale) peuvent réduire la quantité de virus dans votre corps à des niveaux indétectables, ce qui signifie que vous ne pouvez pas transmettre le VIH à d'autres et pouvez maintenir une bonne santé. Beaucoup de personnes vivant avec le VIH travaillent, ont des relations, fondent des familles et poursuivent leurs rêves. Votre diagnostic ne vous définit pas, et il existe toute une communauté de personnes qui mènent des vies pleines et dynamiques avec le VIH.",
      tags: ["vivre avec le VIH", "vie normale", "santé", "espoir"],
    },
    {
      id: "8",
      category: "Vivre avec le VIH",
      categoryKey: "living",
      question: "Comment puis-je parler de mon statut à mon partenaire ?",
      answer: "Révéler votre statut VIH à un partenaire peut être accablant, et il n'y a pas une seule 'bonne' façon de le faire. Choisissez un cadre privé et confortable lorsque vous avez tous les deux le temps de parler. Vous voudrez peut-être préparer ce que vous allez dire, et rappelez-vous que vous partagez des informations importantes sur la santé—vous ne demandez pas pardon. Si vous êtes sous traitement efficace et indétectable, vous pouvez partager que vous ne pouvez pas transmettre le VIH. Certaines personnes trouvent utile d'apporter du matériel éducatif. Rappelez-vous, vous méritez le respect et le soutien. Si vous avez besoin d'aide pour préparer cette conversation, nous sommes là pour vous soutenir.",
      tags: ["divulgation", "partenaire", "relations", "communication"],
    },
    {
      id: "9",
      category: "Ressources de Soutien",
      categoryKey: "support",
      question: "Où puis-je trouver un soutien émotionnel ?",
      answer: "Vous n'avez pas à naviguer cela seul. Il existe de nombreuses sources de soutien disponibles, notamment des groupes de soutien (en personne et en ligne), des conseillers en santé mentale spécialisés dans les soins du VIH, des navigateurs pairs et des lignes d'urgence. De nombreuses organisations offrent des services de counseling gratuits ou à faible coût. Se connecter avec d'autres qui comprennent votre expérience peut être incroyablement précieux. Nous sommes là pour vous aider à trouver le soutien qui vous convient.",
      tags: ["soutien", "émotionnel", "counseling", "communauté"],
    },
    {
      id: "10",
      category: "Ressources de Soutien",
      categoryKey: "support",
      question: "Quelles protections légales existent pour les personnes vivant avec le VIH ?",
      answer: "Les personnes vivant avec le VIH sont protégées par l'Americans with Disabilities Act (ADA), qui interdit la discrimination en matière d'emploi, de logement et d'hébergement public. Votre statut VIH est une information médicale confidentielle, et les professionnels de la santé sont tenus de protéger votre vie privée en vertu de la HIPAA. Les lois varient selon l'État concernant les exigences de divulgation aux partenaires sexuels. Si vous faites face à de la discrimination ou avez des questions sur vos droits, les organisations d'aide juridique peuvent fournir des conseils et un soutien.",
      tags: ["légal", "droits", "discrimination", "vie privée"],
    },
    {
      id: "11",
      category: "Prévention et PrEP",
      categoryKey: "prevention",
      question: "Comment puis-je commencer la PrEP ?",
      answer: "Commencer la PrEP implique quelques étapes : d'abord, vous devrez consulter un professionnel de la santé qui peut la prescrire. Il vous testera pour le VIH (pour confirmer que vous êtes négatif) et vérifiera votre fonction rénale. Si la PrEP vous convient, il rédigera une ordonnance. De nombreux régimes d'assurance couvrent la PrEP, et il existe des programmes d'assistance si le coût est un problème. Une fois que vous commencez, vous prendrez un comprimé par jour. Votre professionnel voudra vous voir tous les quelques mois pour des tests de suivi et pour s'assurer que tout se passe bien. Prendre cette mesure pour protéger votre santé est quelque chose dont vous pouvez être fier.",
      tags: ["PrEP", "début", "ordonnance", "santé"],
    },
    {
      id: "12",
      category: "Vivre avec le VIH",
      categoryKey: "living",
      question: "Puis-je avoir des enfants si je vis avec le VIH ?",
      answer: "Oui, les personnes vivant avec le VIH peuvent avoir des enfants en bonne santé. Avec des soins médicaux et un traitement appropriés, le risque de transmettre le VIH à votre bébé pendant la grossesse ou l'accouchement est inférieur à 1%. Cela implique de prendre des médicaments contre le VIH pendant la grossesse, d'ajuster potentiellement votre plan de traitement et parfois d'utiliser du lait maternisé au lieu de l'allaitement (selon votre situation et votre emplacement). Beaucoup de personnes vivant avec le VIH sont devenues parents et ont des enfants en bonne santé, séronégatifs. Si vous envisagez de fonder une famille, il est important de parler avec un spécialiste du VIH qui a de l'expérience dans les soins de grossesse.",
      tags: ["grossesse", "enfants", "famille", "transmission"],
    },
  ],
  tr: [
    {
      id: "1",
      category: "Test ve Teşhis",
      categoryKey: "testing",
      question: "HIV'ye maruz kaldığımı düşünüyorsam ne yapmalıyım?",
      answer: "HIV'ye maruz kalmış olabileceğinize inanıyorsanız, hızlı hareket etmek önemlidir. Maruziyet sonrası profilaksi (PEP), maruziyetten sonraki 72 saat içinde başlanırsa HIV enfeksiyonunu önleyebilen bir ilaçtır. Hemen bir sağlık uzmanına, yerel kliniğe veya acil servise başvurun. Bunun korkutucu olabileceğini anlıyoruz ve yalnız değilsiniz. Birçok insan bu durumu yaşadı ve size yardımcı olabilecek kaynaklar mevcut.",
      tags: ["maruziyet", "PEP", "acil", "test"],
    },
    {
      id: "2",
      category: "Test ve Teşhis",
      categoryKey: "testing",
      question: "HIV testleri ne kadar doğrudur?",
      answer: "Modern HIV testleri oldukça doğrudur. Dördüncü nesil testler, maruziyetten sonraki 2-4 hafta içinde HIV'yi %99'dan fazla doğrulukla tespit edebilir. Pencere döneminden (genellikle 3 ay) sonra negatif test ederseniz, sonuç kesin kabul edilir. Ancak, yakın zamanda maruziyet yaşadıysanız, pencere döneminden sonra tekrar test yaptırmak önemlidir. Sonuçlarınızı ve bir sonraki adımları anlamanıza yardımcı olmak için buradayız.",
      tags: ["test", "doğruluk", "pencere dönemi", "teşhis"],
    },
    {
      id: "3",
      category: "Test ve Teşhis",
      categoryKey: "testing",
      question: "Nerede gizli olarak test yaptırabilirim?",
      answer: "Yerel sağlık departmanları, toplum sağlık merkezleri, özel doktor ofisleri ve bazı eczaneler dahil olmak üzere birçok yerde test yaptırabilirsiniz. Birçok yer ücretsiz veya düşük maliyetli test sunar ve sonuçlarınız gizlidir. Bazı yerler 20 dakikada sonuç veren hızlı test sunar. Bölgenizde gizliliğinize saygı gösteren ve destekleyici bakım sağlayan test yerleri bulmanıza yardımcı olabiliriz.",
      tags: ["test", "gizli", "yerler", "gizlilik"],
    },
    {
      id: "4",
      category: "Önleme ve PrEP",
      categoryKey: "prevention",
      question: "PrEP nedir ve bunu düşünmeli miyim?",
      answer: "PrEP (Maruziyet Öncesi Profilaksi), cinsel ilişki veya enjeksiyon yoluyla uyuşturucu kullanımı yoluyla HIV kapma riskinizi önemli ölçüde azaltabilen günlük bir ilaçtır. Tutarlı bir şekilde alındığında, PrEP HIV'yi önlemede %99'a kadar etkilidir. HIV maruziyeti riski daha yüksek olan kişilere önerilir. Bir sağlık uzmanıyla konuşmak, PrEP'in sizin için uygun olup olmadığını belirlemenize yardımcı olabilir. Burada yargı yok—sağlığınıza dikkat etmek önemlidir ve PrEP geçerli bir önleme seçeneğidir.",
      tags: ["PrEP", "önleme", "ilaç", "koruma"],
    },
    {
      id: "5",
      category: "Tedavi ve İlaç",
      categoryKey: "treatment",
      question: "HIV ilaçlarının yan etkileri nelerdir?",
      answer: "Modern HIV ilaçları genellikle iyi tolere edilir ve birçok insan az veya hiç yan etki yaşamaz. Yan etkiler ortaya çıktığında, genellikle ilk birkaç hafta boyunca mide bulantısı, yorgunluk veya baş ağrıları gibi hafif ve geçicidir. Ciddi yan etkiler nadirdir. Sağlık uzmanınız, vücudunuz için çalışan bir ilaç rejimi bulmak için sizinle çalışacaktır. Yan etkiler yaşıyorsanız, bakım ekibinizle iletişim kurmak önemlidir—tedavinizi ayarlamaya yardımcı olabilirler.",
      tags: ["ilaç", "yan etkiler", "tedavi", "sağlık"],
    },
    {
      id: "6",
      category: "Tedavi ve İlaç",
      categoryKey: "treatment",
      question: "HIV tedavisi ücretsiz mi yoksa sigorta tarafından karşılanıyor mu?",
      answer: "HIV tedavisi genellikle sigorta tarafından karşılanır, Medicaid ve Medicare dahil. Sigortasız veya yetersiz sigortalı olanlar için Ryan White HIV/AIDS Programı, ilaç hasta yardım programları ve eyalet AIDS İlaç Yardım Programları (ADAP) gibi yardım programları da mevcuttur. Birçok klinik gelire dayalı kademeli ücretler sunar. Bunu tek başınıza yapmak zorunda değilsiniz—ihtiyacınız olan bakıma erişmek için kaynaklarla bağlantı kurmanıza yardımcı olabiliriz.",
      tags: ["sigorta", "maliyet", "mali yardım", "tedavi"],
    },
    {
      id: "7",
      category: "HIV ile Yaşamak",
      categoryKey: "living",
      question: "HIV ile normal bir hayat yaşayabilir miyim?",
      answer: "Evet, kesinlikle. Modern tedavi ile HIV ile yaşayan insanlar uzun, sağlıklı ve dolu bir hayat yaşayabilir. Etkili HIV ilaçları (antiretroviral tedavi), vücudunuzdaki virüs miktarını tespit edilemez seviyelere düşürebilir, bu da HIV'i başkalarına bulaştıramayacağınız ve iyi sağlığı koruyabileceğiniz anlamına gelir. HIV ile yaşayan birçok insan çalışır, ilişkiler kurar, aile kurar ve hayallerini takip eder. Teşhisiniz sizi tanımlamaz ve HIV ile dolu, canlı hayatlar yaşayan bütün bir topluluk var.",
      tags: ["HIV ile yaşamak", "normal hayat", "sağlık", "umut"],
    },
    {
      id: "8",
      category: "HIV ile Yaşamak",
      categoryKey: "living",
      question: "Partnerime durumumu nasıl söyleyebilirim?",
      answer: "HIV durumunuzu bir partnere açıklamak bunaltıcı olabilir ve bunu yapmanın tek bir 'doğru' yolu yoktur. İkinizin de konuşmak için zamanınız olduğunda özel, rahat bir ortam seçin. Ne söyleyeceğinizi hazırlamak isteyebilirsiniz ve önemli sağlık bilgileri paylaştığınızı unutmayın—af dilemiyorsunuz. Etkili bir tedavi görüyorsanız ve tespit edilemezseniz, HIV'i bulaştıramayacağınızı paylaşabilirsiniz. Bazı insanlar eğitim materyalleri getirmenin yardımcı olduğunu bulur. Unutmayın, saygı ve destek hak ediyorsunuz. Bu konuşmaya hazırlanmak için yardıma ihtiyacınız varsa, size destek olmak için buradayız.",
      tags: ["açıklama", "partner", "ilişkiler", "iletişim"],
    },
    {
      id: "9",
      category: "Destek Kaynakları",
      categoryKey: "support",
      question: "Duygusal destek nerede bulabilirim?",
      answer: "Bunu tek başınıza yapmak zorunda değilsiniz. Yüz yüze ve çevrimiçi destek grupları, HIV bakımında uzmanlaşmış ruh sağlığı danışmanları, akran navigatörleri ve kriz hatları dahil olmak üzere birçok destek kaynağı mevcuttur. Birçok organizasyon ücretsiz veya düşük maliyetli danışmanlık hizmetleri sunar. Deneyiminizi anlayan diğerleriyle bağlantı kurmak inanılmaz derecede değerli olabilir. Size uygun gelen desteği bulmanıza yardımcı olmak için buradayız.",
      tags: ["destek", "duygusal", "danışmanlık", "topluluk"],
    },
    {
      id: "10",
      category: "Destek Kaynakları",
      categoryKey: "support",
      question: "HIV ile yaşayan insanlar için hangi yasal korumalar mevcuttur?",
      answer: "HIV ile yaşayan insanlar, istihdam, konut ve kamu konaklama yerlerinde ayrımcılığı yasaklayan Amerikalılar Engellilik Yasası (ADA) tarafından korunmaktadır. HIV durumunuz gizli tıbbi bilgidir ve sağlık uzmanları HIPAA kapsamında gizliliğinizi korumakla yükümlüdür. Cinsel partnerlere açıklama gereklilikleri konusunda yasalar eyalete göre değişir. Ayrımcılıkla karşılaşıyorsanız veya haklarınız hakkında sorularınız varsa, yasal yardım kuruluşları rehberlik ve destek sağlayabilir.",
      tags: ["yasal", "haklar", "ayrımcılık", "gizlilik"],
    },
    {
      id: "11",
      category: "Önleme ve PrEP",
      categoryKey: "prevention",
      question: "PrEP'e nasıl başlayabilirim?",
      answer: "PrEP'e başlamak birkaç adım içerir: önce onu reçete edebilecek bir sağlık uzmanına görünmeniz gerekir. Sizi HIV için test edecekler (negatif olduğunuzu doğrulamak için) ve böbrek fonksiyonunuzu kontrol edecekler. PrEP sizin için uygunsa, bir reçete yazacaklar. Birçok sigorta planı PrEP'i kapsar ve maliyet bir sorunsa yardım programları vardır. Başladığınızda, günde bir hap alacaksınız. Sağlayıcınız sizi birkaç ayda bir takip testleri için görmek ve her şeyin iyi gittiğinden emin olmak isteyecektir. Sağlığınızı korumak için bu adımı atmak gurur duyabileceğiniz bir şeydir.",
      tags: ["PrEP", "başlangıç", "reçete", "sağlık"],
    },
    {
      id: "12",
      category: "HIV ile Yaşamak",
      categoryKey: "living",
      question: "HIV ile yaşıyorsam çocuk sahibi olabilir miyim?",
      answer: "Evet, HIV ile yaşayan insanlar sağlıklı çocuklara sahip olabilir. Uygun tıbbi bakım ve tedavi ile, hamilelik veya doğum sırasında bebeğinize HIV bulaştırma riski %1'den azdır. Bu, hamilelik sırasında HIV ilaçları almayı, tedavi planınızı potansiyel olarak ayarlamayı ve bazen emzirme yerine formül kullanmayı içerir (durumunuza ve konumunuza bağlı olarak). HIV ile yaşayan birçok insan ebeveyn olmuş ve sağlıklı, HIV negatif çocuklara sahip olmuştur. Bir aile kurmayı düşünüyorsanız, hamilelik bakımında deneyimi olan bir HIV uzmanıyla konuşmak önemlidir.",
      tags: ["hamilelik", "çocuklar", "aile", "bulaşma"],
    },
  ],
};

export const faqCategories = [
  "Testing & Diagnosis",
  "Treatment & Medication",
  "Living with HIV",
  "Prevention & PrEP",
  "Support Resources",
] as const;

export function getFAQsByLocale(locale: Locale = 'en'): FAQItem[] {
  return faqDataByLocale[locale] || faqDataByLocale.en;
}

export function getCategoriesByLocale(locale: Locale = 'en'): string[] {
  const faqs = getFAQsByLocale(locale);
  return Array.from(new Set(faqs.map((faq) => faq.category)));
}

export function searchFAQsByLocale(query: string, locale: Locale = 'en'): FAQItem[] {
  const faqs = getFAQsByLocale(locale);
  if (!query.trim()) {
    return faqs;
  }

  const lowerQuery = query.toLowerCase();
  return faqs.filter((faq) => {
    const questionMatch = faq.question.toLowerCase().includes(lowerQuery);
    const answerMatch = faq.answer.toLowerCase().includes(lowerQuery);
    const tagMatch = faq.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
    return questionMatch || answerMatch || tagMatch;
  });
}

export function getFAQsByCategory(category: string, locale: Locale = 'en'): FAQItem[] {
  const faqs = getFAQsByLocale(locale);
  return faqs.filter((faq) => faq.category === category);
}

