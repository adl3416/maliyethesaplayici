import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Text as RNText, useColorScheme, Switch, Modal, FlatList, KeyboardAvoidingView, Platform, RefreshControl, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import * as SplashScreen from 'expo-splash-screen';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

// Keep native splash visible until we explicitly hide it
SplashScreen.preventAutoHideAsync().catch(() => {});

// Custom Text component with font scaling disabled
const Text = (props) => <RNText allowFontScaling={false} {...props} />;

const translations = {
  tr: {
    navTitle: "Borsa Maliyet Hesaplayıcı",
    heroTitles: [
      { t1: "Yatırımlarınızı", t2: "Akıllıca Yönetin" },
      { t1: "Zararınızı", t2: "Kâra Dönüştürün" },
      { t1: "Ortalama Maliyeti", t2: "Optimize Edin" }
    ],
    heroDesc: "Hedef ortalama fiyata ulaşmak için kaç birim satın almanız gerektiğini saniyeler içinde doğru hesaplayın.",
    calcTitle: "Hesaplayıcı",
    labelCurrentQty: "Güncel Mİktar",
    labelCurrentPrice: "Güncel Ort. Fİyatı",
    labelNewPrice: "Yenİ Fİyat",
    labelTargetPrice: "Hedef Ort. Fİyatı",
    resultTitle: "Satın Alınacak Mİktar",
    totalCost: "Tahmİnİ Malİyet",
    newTotalQty: "Yenİ Toplam:",
    errorRange: "Hedef fiyat, güncel fiyat ile yeni fiyat arasında olmalıdır.",
    errorEqual: "Hedef fiyat yeni fiyata eşit olamaz.",
    privacyTitle: "Gizlilik Politikası",
    privacy: "Kişisel verileriniz güvenle saklanır. Bu uygulama çevrimdışıda çalışır ve sunuculara veri göndermez. Tüm hesaplamalar cihazınızda yapılır.",
    termsTitle: "Kullanım Koşulları",
    terms: "Bu uygulama yatırım tavsiyesi vermez. Kullanıcılar kendi sorumluluğunda kullanır. Yapılan hesaplamalar tahmin amaçlıdır.",
    aboutTitle: "Hakkında",
    about: "Borsa Maliyet Hesaplayıcı v1.0 • Hisse senedi ortalaması hesaplayan açık kaynaklı araç.",
    footerText: "Borsa Maliyet Hesaplayıcı • v1.0.2025"
  },
  en: {
    navTitle: "Stock Cost Calculator",
    footerText: "Stock Cost Calculator • v1.0.2025",
    heroTitles: [
      { t1: "Manage Your", t2: "Investments Wisely" },
      { t1: "Turn Your", t2: "Losses into Gains" },
      { t1: "Optimize Your", t2: "Average Cost" }
    ],
    heroDesc: "Accurately calculate how many units you need to buy to reach your target average price in seconds.",
    calcTitle: "Calculator",
    labelCurrentQty: "Current Quantity",
    labelCurrentPrice: "Current Avg. Price",
    labelNewPrice: "New Price",
    labelTargetPrice: "Target Avg. Price",
    resultTitle: "Quantity to Buy",
    totalCost: "Estimated Cost",
    newTotalQty: "New Total:",
    errorRange: "Target price must be between current price and new price.",
    errorEqual: "Target price cannot be equal to new price.",
    privacyTitle: "Privacy Policy",
    privacy: "Your personal data is kept secure. This app works offline and does not send data to servers. All calculations are done on your device.",
    termsTitle: "Terms of Use",
    terms: "This app does not provide investment advice. Users use it at their own responsibility. Calculations are estimates only.",
    aboutTitle: "About",
    about: "Stock Cost Calculator v1.0 • Open source tool for calculating stock averaging."
  },
  de: {
    navTitle: "Aktienkosten-Rechner",
    footerText: "Aktienkosten-Rechner • v1.0.2025",
    heroTitles: [
      { t1: "Verwalten Sie Ihre", t2: "Investitionen klug" },
      { t1: "Verwandeln Sie Ihre", t2: "Verluste in Gewinne" },
      { t1: "Optimieren Sie Ihre", t2: "Durchschnittskosten" }
    ],
    heroDesc: "Berechnen Sie in Sekunden genau, wie viele Einheiten Sie kaufen müssen, um Ihren Zieldurchschnittspreis zu erreichen.",
    calcTitle: "Rechner",
    labelCurrentQty: "Akt. Menge",
    labelCurrentPrice: "Akt. Ø-Preis",
    labelNewPrice: "Neuer Preis",
    labelTargetPrice: "Ziel Ø-Preis",
    resultTitle: "Kaufmenge",
    totalCost: "Ges. Kosten",
    newTotalQty: "Gesamt:",
    errorRange: "Der Zielpreis muss zwischen dem aktuellen Preis und dem neuen Preis liegen.",
    errorEqual: "Der Zielpreis kann nicht gleich dem neuen Preis sein.",
    privacyTitle: "Datenschutzrichtlinie",
    privacy: "Ihre persönlichen Daten werden sicher gespeichert. Diese App funktioniert offline und sendet keine Daten an Server. Alle Berechnungen erfolgen auf Ihrem Gerät.",
    termsTitle: "Nutzungsbedingungen",
    terms: "Diese App bietet keine Anlageberatung. Benutzer verwenden sie auf eigenes Risiko. Berechnungen sind nur Schätzungen.",
    aboutTitle: "Über",
    about: "Aktienkosten-Rechner v1.0 • Open-Source-Tool zur Berechnung von Aktienoptimierungen."
  },
  ru: {
    navTitle: "Калькулятор Стоимости Акций",
    footerText: "Калькулятор Стоимости • v1.0.2025",
    heroTitles: [
      { t1: "Управляйте Своими", t2: "Инвестициями Мудро" },
      { t1: "Превратите Свои", t2: "Убытки в Прибыль" },
      { t1: "Оптимизируйте Вашу", t2: "Среднюю Стоимость" }
    ],
    heroDesc: "Точно рассчитайте, сколько единиц вам нужно купить, чтобы достичь целевой средней цены за считанные секунды.",
    calcTitle: "Калькулятор",
    labelCurrentQty: "Текущее Кол-во",
    labelCurrentPrice: "Тек. Ср. Цена",
    labelNewPrice: "Новая Цена",
    labelTargetPrice: "Целевая Ср. Цена",
    resultTitle: "Количество к Покупке",
    totalCost: "Предполагаемая Стоимость",
    newTotalQty: "Новый Итог:",
    errorRange: "Целевая цена должна быть между текущей ценой и новой ценой.",
    errorEqual: "Целевая цена не может быть равна новой цене.",
    privacyTitle: "Политика конфиденциальности",
    privacy: "Ваши личные данные надежно защищены. Это приложение работает в автономном режиме и не отправляет данные на серверы. Все расчеты выполняются на вашем устройстве.",
    termsTitle: "Условия использования",
    terms: "Это приложение не предоставляет инвестиционные советы. Пользователи используют его на свой риск. Расчеты только приблизительные.",
    aboutTitle: "О приложении",
    about: "Калькулятор Стоимости Акций v1.0 • Инструмент с открытым исходным кодом для расчета средней стоимости."
  },
  it: {
    navTitle: "Calcolatore Costo Azioni",
    footerText: "Calcolatore Costo Azioni • v1.0.2025",
    heroTitles: [
      { t1: "Gestisci I Tuoi", t2: "Investimenti Saggiamente" },
      { t1: "Trasforma Le Tue", t2: "Perdite in Guadagni" },
      { t1: "Ottimizza Il Tuo", t2: "Costo Medio" }
    ],
    heroDesc: "Calcola accuratamente quante unità hai bisogno di acquistare per raggiungere il tuo prezzo medio target in secondi.",
    calcTitle: "Calcolatore",
    labelCurrentQty: "Quantità Attuale",
    labelCurrentPrice: "Prezzo Medio Attuale",
    labelNewPrice: "Nuovo Prezzo",
    labelTargetPrice: "Prezzo Medio Target",
    resultTitle: "Quantità da Acquistare",
    totalCost: "Costo Stimato",
    newTotalQty: "Nuovo Totale:",
    errorRange: "Il prezzo target deve essere tra il prezzo attuale e il nuovo prezzo.",
    errorEqual: "Il prezzo target non può essere uguale al nuovo prezzo.",
    privacyTitle: "Politica sulla Privacy",
    privacy: "I tuoi dati personali sono archiviati in modo sicuro. Questa app funziona offline e non invia dati ai server. Tutti i calcoli vengono eseguiti sul tuo dispositivo.",
    termsTitle: "Condizioni d'Uso",
    terms: "Questa app non fornisce consulenza sugli investimenti. Gli utenti la utilizzano a proprio rischio. I calcoli sono solo stime.",
    aboutTitle: "Chi Siamo",
    about: "Calcolatore Costo Azioni v1.0 • Strumento open source per il calcolo della media dei costi azionari."
  },
  fr: {
    navTitle: "Calculateur de Coût d'Actions",
    footerText: "Calculateur de Coût • v1.0.2025",
    heroTitles: [
      { t1: "Gérez Vos", t2: "Investissements Sagement" },
      { t1: "Transformez Vos", t2: "Pertes en Gains" },
      { t1: "Optimisez Votre", t2: "Coût Moyen" }
    ],
    heroDesc: "Calculez avec précision le nombre d'unités que vous devez acheter pour atteindre votre prix moyen cible en quelques secondes.",
    calcTitle: "Calculatrice",
    labelCurrentQty: "Quantité Actuelle",
    labelCurrentPrice: "Prix Moyen Actuel",
    labelNewPrice: "Nouveau Prix",
    labelTargetPrice: "Prix Moyen Cible",
    resultTitle: "Quantité à Acheter",
    totalCost: "Coût Estimé",
    newTotalQty: "Nouveau Total:",
    errorRange: "Le prix cible doit être entre le prix actuel et le nouveau prix.",
    errorEqual: "Le prix cible ne peut pas être égal au nouveau prix.",
    privacyTitle: "Politique de Confidentialité",
    privacy: "Vos données personnelles sont stockées en toute sécurité. Cette application fonctionne hors ligne et n'envoie pas de données aux serveurs. Tous les calculs sont effectués sur votre appareil.",
    termsTitle: "Conditions d'Utilisation",
    terms: "Cette application ne fournit pas de conseils d'investissement. Les utilisateurs l'utilisent à leurs propres risques. Les calculs sont à titre indicatif uniquement.",
    aboutTitle: "À Propos",
    about: "Calculateur de Coût d'Actions v1.0 • Outil open source pour calculer la moyenne des coûts d'actions."
  },
  es: {
    navTitle: "Calculadora de Costo de Acciones",
    footerText: "Calculadora de Costo • v1.0.2025",
    heroTitles: [
      { t1: "Gestiona Tus", t2: "Inversiones Sabiamente" },
      { t1: "Convierte Tus", t2: "Pérdidas en Ganancias" },
      { t1: "Optimiza Tu", t2: "Costo Promedio" }
    ],
    heroDesc: "Calcula con precisión cuántas unidades necesitas comprar para alcanzar tu precio promedio objetivo en segundos.",
    calcTitle: "Calculadora",
    labelCurrentQty: "Cant. Actual",
    labelCurrentPrice: "Precio Prom. Act.",
    labelNewPrice: "Nuevo Precio",
    labelTargetPrice: "Precio Prom. Obj.",
    resultTitle: "Cantidad a Comprar",
    totalCost: "Costo Estimado",
    newTotalQty: "Nuevo Total:",
    errorRange: "El precio objetivo debe estar entre el precio actual y el nuevo precio.",
    errorEqual: "El precio objetivo no puede ser igual al nuevo precio.",
    privacyTitle: "Política de Privacidad",
    privacy: "Tus datos personales se almacenan de forma segura. Esta aplicación funciona sin conexión y no envía datos a servidores. Todos los cálculos se realizan en tu dispositivo.",
    termsTitle: "Términos de Uso",
    terms: "Esta aplicación no proporciona asesoramiento de inversión. Los usuarios la usan bajo su propio riesgo. Los cálculos son solo estimaciones.",
    aboutTitle: "Acerca de",
    about: "Calculadora de Costo de Acciones v1.0 • Herramienta de código abierto para calcular el promedio de costos de acciones."
  },
  pt: {
    navTitle: "Calculadora de Custo de Ações",
    footerText: "Calculadora de Custo • v1.0.2025",
    heroTitles: [
      { t1: "Gerencie Seus", t2: "Investimentos Sabiamente" },
      { t1: "Transforme Suas", t2: "Perdas em Ganhos" },
      { t1: "Otimize Seu", t2: "Custo Médio" }
    ],
    heroDesc: "Calcule com precisão quantas unidades você precisa comprar para atingir seu preço médio alvo em segundos.",
    calcTitle: "Calculadora",
    labelCurrentQty: "Quantidade Atual",
    labelCurrentPrice: "Preço Médio Atual",
    labelNewPrice: "Novo Preço",
    labelTargetPrice: "Preço Médio Alvo",
    resultTitle: "Quantidade a Comprar",
    totalCost: "Custo Estimado",
    newTotalQty: "Novo Total:",
    errorRange: "O preço alvo deve estar entre o preço atual e o novo preço.",
    errorEqual: "O preço alvo não pode ser igual ao novo preço.",
    privacyTitle: "Política de Privacidade",
    privacy: "Seus dados pessoais são armazenados com segurança. Este aplicativo funciona offline e não envia dados para servidores. Todos os cálculos são feitos no seu dispositivo.",
    termsTitle: "Termos de Uso",
    terms: "Este aplicativo não fornece conselhos de investimento. Os usuários o usam por conta e risco próprio. Os cálculos são apenas estimativas.",
    aboutTitle: "Sobre",
    about: "Calculadora de Custo de Ações v1.0 • Ferramenta de código aberto para calcular a média de custos de ações."
  },
  ja: {
    navTitle: "株式コスト計算機",
    footerText: "株式コスト計算機 • v1.0.2025",
    heroTitles: [
      { t1: "投資を", t2: "賢く管理" },
      { t1: "損失を", t2: "利益に変換" },
      { t1: "平均コストを", t2: "最適化" }
    ],
    heroDesc: "目標平均価格に到達するために必要な購入数量を数秒で正確に計算します。",
    calcTitle: "計算機",
    labelCurrentQty: "現在の数量",
    labelCurrentPrice: "現在の平均価格",
    labelNewPrice: "新しい価格",
    labelTargetPrice: "目標平均価格",
    resultTitle: "購入必要数",
    totalCost: "推定コスト",
    newTotalQty: "新合計:",
    errorRange: "目標価格は現在の価格と新しい価格の間である必要があります。",
    errorEqual: "目標価格は新しい価格と等しくできません。",
    privacyTitle: "プライバシーポリシー",
    privacy: "個人情報は安全に保存されます。このアプリはオフラインで動作し、データをサーバーに送信しません。すべての計算はデバイス上で行われます。",
    termsTitle: "利用規約",
    terms: "このアプリは投資アドバイスを提供しません。ユーザーは自己の責任において使用します。計算は推定値のみです。",
    aboutTitle: "について",
    about: "株式コスト計算機 v1.0 • 株式平均計算用のオープンソースツール。"
  },
  zh: {
    navTitle: "股票成本计算器",
    footerText: "股票成本计算器 • v1.0.2025",
    heroTitles: [
      { t1: "智能管理", t2: "您的投资" },
      { t1: "将亏损", t2: "转为盈利" },
      { t1: "优化您的", t2: "平均成本" }
    ],
    heroDesc: "在几秒钟内准确计算您需要购买多少才能达到目标平均价格。",
    calcTitle: "计算器",
    labelCurrentQty: "当前数量",
    labelCurrentPrice: "当前均价",
    labelNewPrice: "新价格",
    labelTargetPrice: "目标均价",
    resultTitle: "需要购买",
    totalCost: "预估成本",
    newTotalQty: "新总计:",
    errorRange: "目标价格必须在当前价格和新价格之间。",
    errorEqual: "目标价格不能等于新价格。",
    privacyTitle: "隐私政策",
    privacy: "您的个人数据安全存储。此应用离线工作，不向服务器发送数据。所有计算都在您的设备上进行。",
    termsTitle: "使用条款",
    terms: "本应用不提供投资建议。用户自行承担责任。计算仅供参考。",
    aboutTitle: "关于",
    about: "股票成本计算器 v1.0 • 用于计算股票平均成本的开源工具。"
  }
};

const currencySymbols = {
  'TRY': '₺',
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'RUB': '₽',
  'JPY': '¥',
  'CNY': '¥'
};

const langToCurrency = {
  'tr': 'TRY',
  'en': 'USD',
  'de': 'EUR',
  'ru': 'RUB',
  'it': 'EUR',
  'fr': 'EUR',
  'es': 'EUR',
  'pt': 'EUR',
  'ja': 'JPY',
  'zh': 'CNY'
};

export default function App() {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [language, setLanguage] = useState('tr');
  const [currency, setCurrency] = useState('TRY');
  const [titleIndex, setTitleIndex] = useState(0);

  const [currentQty, setCurrentQty] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  const [legalType, setLegalType] = useState('privacy');
  const [refreshing, setRefreshing] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingPage, setOnboardingPage] = useState(0);
  const [deviceLangCode, setDeviceLangCode] = useState('en');

  const titleRotationRef = useRef(null);
  const scrollRef = useRef(null);
  
  useEffect(() => {
    const initializeApp = async () => {
      await loadSettings();
    };
    initializeApp();

    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const keyboardHideSubscription = Keyboard.addListener(keyboardHideEvent, () => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });

    return () => {
      keyboardHideSubscription.remove();
    };
  }, []);

  // Title rotation
  useEffect(() => {
    if (titleRotationRef.current) clearInterval(titleRotationRef.current);
    titleRotationRef.current = setInterval(() => {
      setTitleIndex(prev => (prev + 1) % translations[language].heroTitles.length);
    }, 3000);

    return () => {
      if (titleRotationRef.current) clearInterval(titleRotationRef.current);
    };
  }, [language]);

  const loadSettings = async () => {
    try {
      let detectedLang = 'en';
      
      // Try different methods to detect device language
      try {
        // Method 1: Localization.locale
        if (Localization.locale) {
          const locale = Localization.locale;
          console.log('Method 1 - Localization.locale:', locale);
          detectedLang = locale.split('-')[0];
        }
        // Method 2: Localization.locales (array)
        else if (Localization.locales && Localization.locales.length > 0) {
          console.log('Method 2 - Localization.locales:', Localization.locales);
          detectedLang = Localization.locales[0].split('-')[0];
        }
        // Method 3: Direct property
        else if (Localization.getLocales && typeof Localization.getLocales === 'function') {
          const locales = Localization.getLocales();
          console.log('Method 3 - getLocales():', locales);
          detectedLang = locales[0]?.languageCode || 'en';
        }
      } catch (locErr) {
        console.log('Device detection attempt failed:', locErr);
        detectedLang = 'en';
      }
      
      // Validate language
      const supportedLangs = ['tr', 'en', 'de', 'ru', 'it', 'fr', 'es', 'pt', 'ja', 'zh'];
      detectedLang = supportedLangs.includes(detectedLang) ? detectedLang : 'en';
      console.log('Final language to set:', detectedLang);
      
      setDeviceLangCode(detectedLang);
      setLanguage(detectedLang);
      
      // Theme
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) setIsDark(savedTheme === 'dark');
      else setIsDark(systemColorScheme === 'dark');
      
      // Currency
      const currencyMap = {
        'tr': 'TRY', 'en': 'USD', 'de': 'EUR', 'ru': 'RUB', 'it': 'EUR',
        'fr': 'EUR', 'es': 'EUR', 'pt': 'EUR', 'ja': 'JPY', 'zh': 'CNY'
      };
      setCurrency(currencyMap[detectedLang]);
    } catch (e) {
      console.log('Critical error in loadSettings:', e);
      setLanguage('en');
      setCurrency('USD');
    } finally {
      // Onboarding gösterilmiş mi kontrol et
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      
      // Hide native splash immediately and show custom splash
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.log('SplashScreen hide error:', e);
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));
      setShowSplash(false);
      
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
      
      setAppReady(true);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Tüm input'ları temizle
    setCurrentQty('');
    setCurrentPrice('');
    setNewPrice('');
    setTargetPrice('');
    setResult(null);
    setError(null);
    
    // Refresh animasyonu için kısa bir gecikme
    await new Promise(resolve => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const saveLanguage = async (lang) => {
    setLanguage(lang);
    setCurrency(langToCurrency[lang]);
    await AsyncStorage.setItem('language', lang);
    setTitleIndex(0);
  };

  const saveCurrency = async (curr) => {
    setCurrency(curr);
    await AsyncStorage.setItem('currency', curr);
  };

  const saveTheme = async (dark) => {
    setIsDark(dark);
    await AsyncStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  const scrollToInputs = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 195, animated: true });
      }
    }, 50);
  };

  const calculate = () => {
    const cQty = parseFloat(currentQty);
    const cPrice = parseFloat(currentPrice);
    const nPrice = parseFloat(newPrice);
    const tPrice = parseFloat(targetPrice);

    setResult(null);
    setError(null);

    if (isNaN(cQty) || isNaN(cPrice) || isNaN(nPrice) || isNaN(tPrice)) return;
    if (cQty <= 0 || cPrice <= 0 || nPrice <= 0 || tPrice <= 0) return;

    const isBetween = (nPrice < tPrice && tPrice < cPrice) || (cPrice < tPrice && tPrice < nPrice);

    if (!isBetween) {
      setError(tPrice === nPrice ? translations[language].errorEqual : translations[language].errorRange);
      return;
    }

    const numerator = cQty * (cPrice - tPrice);
    const denominator = tPrice - nPrice;
    const requiredQty = numerator / denominator;

    if (requiredQty > 0) {
      const qtyRounded = Math.ceil(requiredQty);
      const totalCost = qtyRounded * nPrice;
      const newTotalQty = cQty + qtyRounded;

      setResult({
        qty: qtyRounded,
        cost: totalCost,
        newTotal: newTotalQty
      });
      
      // Klavyeyi kapat
      Keyboard.dismiss();
    }
  };

  // Recalculate whenever inputs change
  useEffect(() => {
    calculate();
  }, [currentQty, currentPrice, newPrice, targetPrice]);

  const t = translations[language];
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const textColor = isDark ? '#e5e7eb' : '#111827';
  const cardBg = isDark ? '#1e293b' : '#f9fafb';
  const borderColor = isDark ? '#334155' : '#e5e7eb';
  const inputBg = isDark ? '#334155' : '#f3f4f6';
  const secondaryText = isDark ? '#9ca3af' : '#6b7280';

  const currentTitle = t.heroTitles[titleIndex];

  if (showSplash) {
    // Splash screen'deki yazıyı device language'e göre ayarla
    const splashTexts = {
      'tr': { name: 'Maliyet Hesaplayıcı', desc: 'Hızlı ve Doğru Hesaplamalar' },
      'en': { name: 'Stock Cost Calculator', desc: 'Fast and Accurate Calculations' },
      'de': { name: 'Aktienkosten-Rechner', desc: 'Schnelle und genaue Berechnungen' },
      'ru': { name: 'Калькулятор Стоимости', desc: 'Быстрые и точные расчеты' },
      'it': { name: 'Calcolatore Costo Azioni', desc: 'Calcoli Veloci e Precisi' },
      'fr': { name: 'Calculateur de Coût', desc: 'Calculs Rapides et Précis' },
      'es': { name: 'Calculadora de Costo', desc: 'Cálculos Rápidos y Precisos' },
      'pt': { name: 'Calculadora de Custo', desc: 'Cálculos Rápidos e Precisos' },
      'ja': { name: '株式コスト計算機', desc: '高速で正確な計算' },
      'zh': { name: '股票成本计算器', desc: '快速准确的计算' }
    };
    
    const splashText = splashTexts[deviceLangCode] || splashTexts['en'];
    const names = splashText.name.split(' ');
    
    return (
      <LinearGradient colors={['#1e3a8a', '#3b82f6', '#60a5fa']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Content */}
        <View style={{ alignItems: 'center', zIndex: 10 }}>
          {/* Advanced Calculator Logo */}
          <View style={{ 
            width: 100, 
            height: 100, 
            backgroundColor: 'rgba(255, 255, 255, 0.15)', 
            borderRadius: 20,
            justifyContent: 'flex-start',
            padding: 12,
            marginBottom: 30,
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#3b82f6',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 10
          }}>
            {/* Display Screen */}
            <View style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 8,
              height: 24,
              width: '100%',
              marginBottom: 10,
              paddingRight: 4,
              justifyContent: 'flex-end',
              paddingBottom: 2
            }}>
              <View style={{ 
                width: '70%', 
                height: 4, 
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: 2
              }} />
            </View>
            
            {/* Button Grid - 3x2 */}
            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'space-between' }}>
                <View style={{ width: 18, height: 18, backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 4 }} />
                <View style={{ width: 18, height: 18, backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 4 }} />
                <View style={{ width: 18, height: 18, backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 4 }} />
              </View>
              
              <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'space-between' }}>
                <View style={{ width: 18, height: 18, backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 4 }} />
                <View style={{ width: 18, height: 18, backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 4 }} />
                <View style={{ width: 18, height: 18, backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 4 }} />
              </View>
            </View>
          </View>
          
          <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', paddingHorizontal: 20 }}>
            <Text style={{ color: '#ffffff' }}>{names[0]} </Text>
            <Text style={{ color: '#ffffff' }}>{names.slice(1).join(' ')}</Text>
          </Text>
          
          <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 11, marginBottom: 40, textAlign: 'center', paddingHorizontal: 20 }}>
            {splashText.desc}
          </Text>
          
          <View style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 24, 
            borderWidth: 3, 
            borderColor: 'rgba(255, 255, 255, 0.6)', 
            borderTopColor: 'rgba(255, 255, 255, 1)',
            borderRightColor: 'rgba(255, 255, 255, 1)'
          }} />
        </View>
      </LinearGradient>
    );
  }

  // Onboarding Screens
  if (showOnboarding) {
    const onboardingData = [
      {
        tr: { title: 'Hoş Geldiniz', desc: 'Borsa yatırımlarınızı akıllıca yönetin ve hedef ortalama fiyatınıza ulaşın', icon: '📈' },
        en: { title: 'Welcome', desc: 'Manage your stock investments wisely and reach your target average price', icon: '📈' },
        de: { title: 'Willkommen', desc: 'Verwalten Sie Ihre Börseninvestitionen klug und erreichen Sie Ihren Zieldurchschnittspreis', icon: '📈' },
        ru: { title: 'Добро пожаловать', desc: 'Управляйте своими инвестициями мудро и достигните целевой средней цены', icon: '📈' },
        it: { title: 'Benvenuto', desc: 'Gestisci i tuoi investimenti in borsa in modo saggio e raggiungi il tuo prezzo medio target', icon: '📈' },
        fr: { title: 'Bienvenue', desc: 'Gérez vos investissements en bourse avec sagesse et atteignez votre prix moyen cible', icon: '📈' },
        es: { title: 'Bienvenido', desc: 'Gestiona tus inversiones bursátiles de manera inteligente y alcanza tu precio promedio objetivo', icon: '📈' },
        pt: { title: 'Bem-vindo', desc: 'Gerencie seus investimentos em ações com sabedoria e atinja seu preço médio alvo', icon: '📈' },
        ja: { title: 'ようこそ', desc: '株式投資を賢く管理し、目標平均価格に到達します', icon: '📈' },
        zh: { title: '欢迎', desc: '明智地管理您的股票投资并达到目标平均价格', icon: '📈' }
      },
      {
        tr: { title: 'Nasıl Kullanılır', desc: 'Güncel miktarını ve fiyatını gir, hedef fiyatı belirle ve kaç birim satın almanız gerektiğini öğren', icon: '💡' },
        en: { title: 'How to Use', desc: 'Enter your current quantity and price, set your target price and find out how many units to buy', icon: '💡' },
        de: { title: 'Verwendungsweise', desc: 'Geben Sie Ihre aktuelle Menge und Ihren Preis ein, legen Sie Ihren Zielpreis fest und erfahren Sie, wie viele Einheiten Sie kaufen müssen', icon: '💡' },
        ru: { title: 'Как использовать', desc: 'Введите текущее количество и цену, установите целевую цену и узнайте, сколько единиц покупать', icon: '💡' },
        it: { title: 'Come usare', desc: 'Inserisci la tua quantità e prezzo attuali, imposta il tuo prezzo target e scopri quante unità dovrai acquistare', icon: '💡' },
        fr: { title: 'Comment utiliser', desc: 'Entrez votre quantité et prix actuels, définissez votre prix cible et découvrez combien d\'unités acheter', icon: '💡' },
        es: { title: 'Cómo usar', desc: 'Ingresa tu cantidad y precio actual, establece tu precio objetivo y descubre cuántas unidades comprar', icon: '💡' },
        pt: { title: 'Como usar', desc: 'Digite sua quantidade e preço atuais, defina seu preço alvo e descubra quantas unidades comprar', icon: '💡' },
        ja: { title: '使い方', desc: '現在の数量と価格を入力し、目標価格を設定して、購入する必要のある単位数を確認してください', icon: '💡' },
        zh: { title: '如何使用', desc: '输入您当前的数量和价格，设置目标价格并找出您需要购买的单位数', icon: '💡' }
      },
      {
        tr: { title: 'Başlayalım', desc: 'Artık hazirsınız. Uygulamayı kullanmaya başlayın ve yatırımlarınızı optimize edin!', icon: '🚀' },
        en: { title: 'Get Started', desc: 'You\'re ready now. Start using the app and optimize your investments!', icon: '🚀' },
        de: { title: 'Loslegen', desc: 'Sie sind bereit. Beginnen Sie mit der App und optimieren Sie Ihre Investitionen!', icon: '🚀' },
        ru: { title: 'Начнем', desc: 'Вы готовы. Начните использовать приложение и оптимизируйте свои инвестиции!', icon: '🚀' },
        it: { title: 'Iniziamo', desc: 'Sei pronto. Inizia a utilizzare l\'app e ottimizza i tuoi investimenti!', icon: '🚀' },
        fr: { title: 'Commençons', desc: 'Vous êtes prêt. Commencez à utiliser l\'application et optimisez vos investissements!', icon: '🚀' },
        es: { title: 'Empecemos', desc: '¡Estás listo! Comienza a usar la aplicación y optimiza tus inversiones!', icon: '🚀' },
        pt: { title: 'Vamos começar', desc: 'Você está pronto. Comece a usar o aplicativo e otimize seus investimentos!', icon: '🚀' },
        ja: { title: '始めましょう', desc: '準備ができました。アプリの使用を開始して、投資を最適化してください!', icon: '🚀' },
        zh: { title: '开始', desc: '你已准备好。开始使用应用程序并优化您的投资！', icon: '🚀' }
      }
    ];

    const currentData = onboardingData[onboardingPage][language] || onboardingData[onboardingPage].en;

    const handleNext = () => {
      if (onboardingPage < onboardingData.length - 1) {
        setOnboardingPage(onboardingPage + 1);
      } else {
        finishOnboarding();
      }
    };

    const finishOnboarding = async () => {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setShowOnboarding(false);
      setOnboardingPage(0);
    };

    return (
      <LinearGradient colors={['#1e3a8a', '#3b82f6', '#60a5fa']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
        {/* Background Content Box */}
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 24,
          padding: 32,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.15)',
          width: '100%',
          alignItems: 'center'
        }}>
          {/* Icon */}
          <Text style={{ fontSize: 80, marginBottom: 20 }}>{currentData.icon}</Text>

          {/* Title */}
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: 12 }}>
            {currentData.title}
          </Text>

          {/* Description */}
          <Text style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.85)', textAlign: 'center', lineHeight: 24, marginBottom: 40 }}>
            {currentData.desc}
          </Text>

          {/* Pagination Dots */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 40 }}>
            {onboardingData.map((_, idx) => (
              <View 
                key={idx}
                style={{ 
                  width: idx === onboardingPage ? 24 : 8, 
                  height: 8, 
                  borderRadius: 4, 
                  backgroundColor: idx === onboardingPage ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)'
                }} 
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
            {onboardingPage > 0 && (
              <TouchableOpacity
                onPress={() => setOnboardingPage(onboardingPage - 1)}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  borderWidth: 1.5,
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 14 }}>← Geri</Text>
              </TouchableOpacity>
            )}

            {onboardingPage < onboardingData.length - 1 ? (
              <>
                <TouchableOpacity
                  onPress={finishOnboarding}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1.5,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: '600', fontSize: 14 }}>Atla</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNext}
                  style={{
                    flex: 1.5,
                    backgroundColor: '#ffffff',
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    shadowColor: '#3b82f6',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8
                  }}
                >
                  <Text style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: 14 }}>İleri →</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={finishOnboarding}
                style={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: 'center',
                  shadowColor: '#3b82f6',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8
                }}
              >
                <Text style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: 14 }}>Başla 🚀</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <>
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: bgColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Navigation - Moved outside ScrollView to fix RefreshControl position */}
      <View style={{ 
        backgroundColor: bgColor, 
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingBottom: 16, 
        paddingHorizontal: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: borderColor,
        zIndex: 10
      }}>
        {/* Header Row */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12
        }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: textColor, flex: 1 }}>
            {language === 'tr' && <><Text>Maliyet </Text><Text style={{ color: '#3b82f6' }}>Hesaplayıcı</Text></>}
            {language === 'en' && <><Text>Stock </Text><Text style={{ color: '#3b82f6' }}>Cost Calculator</Text></>}
            {language === 'de' && <><Text>Aktienkosten</Text><Text style={{ color: '#3b82f6' }}>-Rechner</Text></>}
            {language === 'ru' && <><Text>Калькулятор </Text><Text style={{ color: '#3b82f6' }}>Стоимости</Text></>}
            {language === 'it' && <><Text>Calcolatore </Text><Text style={{ color: '#3b82f6' }}>Costo Azioni</Text></>}
            {language === 'fr' && <><Text>Calculateur </Text><Text style={{ color: '#3b82f6' }}>de Coût</Text></>}
            {language === 'es' && <><Text>Calculadora </Text><Text style={{ color: '#3b82f6' }}>de Costo</Text></>}
            {language === 'pt' && <><Text>Calculadora </Text><Text style={{ color: '#3b82f6' }}>de Custo</Text></>}
            {language === 'ja' && <><Text>株式</Text><Text style={{ color: '#3b82f6' }}>コスト計算機</Text></>}
            {language === 'zh' && <><Text>股票</Text><Text style={{ color: '#3b82f6' }}>成本计算器</Text></>}
          </Text>
          
          <TouchableOpacity 
            onPress={() => saveTheme(!isDark)}
            style={{
              backgroundColor: isDark ? '#374151' : '#d1d5db',
              borderRadius: 24,
              width: 56,
              height: 28,
              justifyContent: isDark ? 'flex-end' : 'flex-start',
              paddingHorizontal: 2,
              paddingVertical: 2,
              flexDirection: 'row',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 2
            }}
          >
            <View style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 4
            }}>
              {/* Moon Icon - Light Mode */}
              {!isDark && <MaterialIcons name="nights-stay" size={16} color="#4b5563" />}
              
              {/* Sun Icon - Dark Mode */}
              {isDark && <MaterialIcons name="wb-sunny" size={16} color="#fbbf24" />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Dil ve Döviz Seçenekleri */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {/* Dil Dropdown */}
          <TouchableOpacity
            onPress={() => setShowLangMenu(true)}
            style={{
              flex: 1,
              backgroundColor: inputBg,
              borderWidth: 1,
              borderColor: borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: textColor, fontWeight: '600', fontSize: 12 }}>
              {language === 'tr' ? '🇹🇷' : language === 'en' ? '🇺🇸' : language === 'de' ? '🇩🇪' : language === 'ru' ? '🇷🇺' : language === 'it' ? '🇮🇹' : language === 'fr' ? '🇫🇷' : language === 'es' ? '🇪🇸' : language === 'pt' ? '🇵🇹' : language === 'ja' ? '🇯🇵' : '🇨🇳'} {language.toUpperCase()}
            </Text>
            <Text style={{ color: secondaryText }}>▼</Text>
          </TouchableOpacity>

          {/* Döviz Dropdown */}
          <TouchableOpacity
            onPress={() => setShowCurrencyMenu(true)}
            style={{
              flex: 1,
              backgroundColor: inputBg,
              borderWidth: 1,
              borderColor: borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#3b82f6', fontWeight: '700', fontSize: 14 }}>
                {currencySymbols[currency]}
              </Text>
              <Text style={{ color: textColor, fontWeight: '500', fontSize: 12, marginLeft: 6 }}>
                {currency}
              </Text>
            </View>
            <Text style={{ color: secondaryText }}>▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollRef}
        style={{ flex: 1, backgroundColor: bgColor }} 
        contentContainerStyle={{ paddingBottom: Platform.OS === 'android' ? (result ? 120 : 60) : 100 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            progressBackgroundColor={isDark ? '#1e293b' : '#ffffff'}
          />
        }
      >

      {/* Language Menu Modal */}
      <Modal visible={showLangMenu} transparent animationType="fade">
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
          onPress={() => setShowLangMenu(false)}
        >
          <View style={{
            backgroundColor: cardBg,
            borderRadius: 12,
            margin: 16,
            marginTop: 120,
            maxHeight: 400,
            borderWidth: 1,
            borderColor: borderColor
          }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: 'bold', 
              color: textColor, 
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: borderColor
            }}>
              Dil Seç
            </Text>
            <FlatList
              data={Object.keys(translations)}
              keyExtractor={lang => lang}
              scrollEnabled={true}
              renderItem={({ item: lang }) => (
                <TouchableOpacity
                  onPress={() => {
                    saveLanguage(lang);
                    setShowLangMenu(false);
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                    backgroundColor: language === lang ? '#3b82f6' : 'transparent'
                  }}
                >
                  <Text style={{
                    color: language === lang ? 'white' : textColor,
                    fontWeight: language === lang ? 'bold' : '500',
                    fontSize: 13
                  }}>
                    {lang === 'tr' ? '🇹🇷' : lang === 'en' ? '🇺🇸' : lang === 'de' ? '🇩🇪' : lang === 'ru' ? '🇷🇺' : lang === 'it' ? '🇮🇹' : lang === 'fr' ? '🇫🇷' : lang === 'es' ? '🇪🇸' : lang === 'pt' ? '🇵🇹' : lang === 'ja' ? '🇯🇵' : '🇨🇳'} {lang.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Currency Menu Modal */}
      <Modal visible={showCurrencyMenu} transparent animationType="fade">
        <TouchableOpacity 
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }}
          onPress={() => setShowCurrencyMenu(false)}
        >
          <View style={{
            backgroundColor: cardBg,
            borderRadius: 12,
            margin: 16,
            marginTop: 120,
            maxHeight: 400,
            borderWidth: 1,
            borderColor: borderColor
          }}>
            <Text style={{ 
              fontSize: 14, 
              fontWeight: 'bold', 
              color: textColor, 
              padding: 12,
              borderBottomWidth: 1,
              borderBottomColor: borderColor
            }}>
              Döviz Seç
            </Text>
            <FlatList
              data={Object.keys(currencySymbols)}
              keyExtractor={curr => curr}
              scrollEnabled={true}
              renderItem={({ item: curr }) => (
                <TouchableOpacity
                  onPress={() => {
                    saveCurrency(curr);
                    setShowCurrencyMenu(false);
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                    backgroundColor: currency === curr ? '#3b82f6' : 'transparent'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{
                      color: currency === curr ? 'white' : '#3b82f6',
                      fontWeight: '700',
                      fontSize: 14
                    }}>
                      {currencySymbols[curr]}
                    </Text>
                    <Text style={{
                      color: currency === curr ? 'white' : textColor,
                      fontWeight: currency === curr ? 'bold' : '500',
                      fontSize: 13,
                      marginLeft: 6
                    }}>
                      {curr}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Hero Section */}
      <View style={{ paddingHorizontal: 16, paddingTop: 28, paddingBottom: 20, alignItems: 'center' }}>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text 
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              color: textColor,
              textAlign: 'center',
              marginBottom: 8
            }}
          >
            {currentTitle.t1}
          </Text>
          <Text 
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ 
              fontSize: 32, 
              fontWeight: 'bold', 
              color: '#3b82f6',
              textAlign: 'center',
              marginBottom: 6
            }}
          >
            {currentTitle.t2}
          </Text>
        </View>
        <Text style={{ 
          fontSize: 11, 
          color: secondaryText,
          textAlign: 'center',
          marginBottom: 8,
          lineHeight: 20
        }}>
          {t.heroDesc}
        </Text>
      </View>

      {/* Calculator Card */}
      <View style={{ marginHorizontal: 16, marginTop: 22, marginBottom: 24 }}>
        <View style={{ 
          backgroundColor: cardBg, 
          borderRadius: 20, 
          padding: 20,
          paddingBottom: 27,
          borderWidth: 1,
          borderColor: borderColor
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: textColor }}>
              {t.calcTitle}
            </Text>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' }} />
          </View>

          {/* Input Grid */}
          <View style={{ gap: 20 }}>
            {/* Row 1 */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text 
                  numberOfLines={1} 
                  style={{ fontSize: 10, fontWeight: '600', color: secondaryText, marginBottom: 6, textTransform: 'uppercase' }}
                >
                  {t.labelCurrentQty}
                </Text>
                <TextInput 
                  placeholder="0"
                  keyboardType="decimal-pad"
                  value={currentQty}
                  onChangeText={setCurrentQty}
                  onFocus={scrollToInputs}
                  style={{
                    backgroundColor: inputBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 12,
                    padding: 12,
                    color: textColor,
                    fontSize: 16
                  }}
                  placeholderTextColor={secondaryText}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text 
                  numberOfLines={1} 
                  style={{ fontSize: 10, fontWeight: '600', color: secondaryText, marginBottom: 6, textTransform: 'uppercase' }}
                >
                  {t.labelCurrentPrice}
                </Text>
                <TextInput 
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={currentPrice}
                  onChangeText={setCurrentPrice}
                  onFocus={scrollToInputs}
                  style={{
                    backgroundColor: inputBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 12,
                    padding: 12,
                    color: textColor,
                    fontSize: 16
                  }}
                  placeholderTextColor={secondaryText}
                />
              </View>
            </View>

            {/* Row 2 */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text 
                  numberOfLines={1} 
                  style={{ fontSize: 10, fontWeight: '600', color: secondaryText, marginBottom: 6, textTransform: 'uppercase' }}
                >
                  {t.labelNewPrice}
                </Text>
                <TextInput 
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={newPrice}
                  onChangeText={setNewPrice}
                  onFocus={scrollToInputs}
                  style={{
                    backgroundColor: inputBg,
                    borderWidth: 1,
                    borderColor: borderColor,
                    borderRadius: 12,
                    padding: 12,
                    color: textColor,
                    fontSize: 16
                  }}
                  placeholderTextColor={secondaryText}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text 
                  numberOfLines={1} 
                  style={{ fontSize: 10, fontWeight: 'bold', color: '#3b82f6', marginBottom: 6, textTransform: 'uppercase' }}
                >
                  {t.labelTargetPrice}
                </Text>
                <TextInput 
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={targetPrice}
                  onChangeText={setTargetPrice}
                  onFocus={scrollToInputs}
                  style={{
                    backgroundColor: inputBg,
                    borderWidth: 1.5,
                    borderColor: '#3b82f6',
                    borderRadius: 12,
                    padding: 12,
                    color: textColor,
                    fontSize: 16,
                    fontWeight: 'bold'
                  }}
                  placeholderTextColor={secondaryText}
                />
              </View>
            </View>
          </View>

          {/* Result */}
          {result && !error && (
            <View
              style={{ 
                borderRadius: 16, 
                marginTop: 16, 
                marginBottom: 0,
                backgroundColor: '#3b82f6',
                overflow: 'hidden',
                shadowColor: '#1e3a8a',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
                elevation: 8
              }}
            >
              <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                  <View style={{ flex: 1.2 }}>
                    <Text numberOfLines={1} style={{ fontSize: 10, fontWeight: 'bold', color: '#bfdbfe', textTransform: 'uppercase' }}>
                      {t.resultTitle}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 28, fontWeight: 'bold', color: 'white', marginTop: 4 }}>
                      {result.qty}
                    </Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Text numberOfLines={1} style={{ fontSize: 10, color: '#bfdbfe', textTransform: 'uppercase' }}>
                      {t.totalCost}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: 'bold', color: 'white', marginTop: 4, fontFamily: 'monospace' }}>
                      {currencySymbols[currency]}{result.cost.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.2)', paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text numberOfLines={1} style={{ fontSize: 12, color: '#bfdbfe' }}>
                    {t.newTotalQty}
                  </Text>
                  <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>
                    {result.newTotal}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Error */}
          {error && (
            <View style={{ 
              backgroundColor: isDark ? '#7f1d1d' : '#fee2e2', 
              borderRadius: 16, 
              padding: 12, 
              marginTop: 16
            }}>
              <Text style={{ color: isDark ? '#fca5a5' : '#991b1b', fontSize: 13, fontWeight: '500', textAlign: 'center' }}>
                {error}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>

    {/* Fluid Minimal Footer Bar - Fixed Position */}
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 48,
      backgroundColor: bgColor,
      borderTopWidth: 0.5,
      borderTopColor: borderColor,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: Platform.OS === 'android' ? 48 : 16,
      zIndex: 100
    }}>
      {/* Empty footer - text hidden */}
    </View>

    {/* Legal Content Modal */}
    <Modal
      visible={showLegalMenu} 
      transparent 
      animationType="fade"
      onRequestClose={() => setShowLegalMenu(false)}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ 
          backgroundColor: cardBg, 
          borderRadius: 16, 
          maxHeight: '80%',
          width: '100%',
          borderWidth: 1,
          borderColor: borderColor
        }}>
          {/* Header */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: borderColor
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: textColor, flex: 1 }}>
              {legalType === 'privacy' && t.privacyTitle}
              {legalType === 'terms' && t.termsTitle}
              {legalType === 'about' && t.aboutTitle}
            </Text>
            <TouchableOpacity onPress={() => setShowLegalMenu(false)}>
              <Text style={{ fontSize: 20, color: secondaryText, fontWeight: '300' }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={{ padding: 16 }}>
            <Text style={{ fontSize: 14, color: textColor, lineHeight: 22 }}>
              {legalType === 'privacy' && t.privacy}
              {legalType === 'terms' && t.terms}
              {legalType === 'about' && t.about}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
    </>
  );
}
