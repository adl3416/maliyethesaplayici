import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, FlatList, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const translations = {
  tr: { title: 'Maliyet Hesaplayıcı', heroTitle: 'Zararınızı Kara Dönüştürün', heroDesc: 'Borsa veya kripto piyasalarında maliyetinizi düşürmek için almanız gereken tam miktarı saniyeler içinde hesaplayın.', currentQty: 'Mevcut Adet', currentAvg: 'Mevcut Ort.', newPrice: 'Yeni Fiyat', targetAvg: 'Hedef Ort.', calculate: 'Hesapla', result: 'Sonuç', totalCost: 'Toplam Maliyet', totalQty: 'Toplam Adet', qtyToBuy: 'Alınacak Adet', newTotal: 'Yeni Toplam', newAvg: 'Yeni Ortalama', theme: 'Tema', language: 'Dil', calculator: 'Hesaplayıcı', buyingQty: 'Alınması Gereken', targetAvg2: 'Tahmini Maliyet' },
  en: { title: 'Cost Calculator', heroTitle: 'Turn Your Loss Into Profit', heroDesc: 'Calculate the exact amount you need to buy on the stock or crypto markets to reduce your cost in seconds.', currentQty: 'Current Qty', currentAvg: 'Current Avg', newPrice: 'New Price', targetAvg: 'Target Avg', calculate: 'Calculate', result: 'Result', totalCost: 'Total Cost', totalQty: 'Total Qty', qtyToBuy: 'Qty to Buy', newTotal: 'New Total', newAvg: 'New Average', theme: 'Theme', language: 'Language', calculator: 'Calculator', buyingQty: 'Buy Qty Needed', targetAvg2: 'Estimated Cost' },
  ar: { title: 'حاسبة التكلفة', heroTitle: 'حول خسارتك إلى ربح', heroDesc: 'احسب المبلغ الدقيق الذي تحتاجه في أسواق الأسهم أو العملات المشفرة لتقليل تكاليفك في ثوانٍ', currentQty: 'الكمية الحالية', currentAvg: 'المتوسط الحالي', newPrice: 'السعر الجديد', targetAvg: 'المتوسط المستهدف', calculate: 'احسب', result: 'النتيجة', totalCost: 'إجمالي التكلفة', totalQty: 'إجمالي الكمية', qtyToBuy: 'الكمية للشراء', newTotal: 'الإجمالي الجديد', newAvg: 'المتوسط الجديد', theme: 'المظهر', language: 'اللغة', calculator: 'الحاسبة', buyingQty: 'الكمية المراد شراؤها', targetAvg2: 'التكلفة المتوقعة' },
  de: { title: 'Kostenrechner', heroTitle: 'Verwandeln Sie Ihren Verlust in Gewinn', heroDesc: 'Berechnen Sie in Sekundenschnelle den genauen Betrag, den Sie an den Aktien- oder Kryptomärkten kaufen müssen, um Ihre Kosten zu senken.', currentQty: 'Aktuelle Menge', currentAvg: 'Aktueller Durchschnitt', newPrice: 'Neuer Preis', targetAvg: 'Zieldurchschnitt', calculate: 'Berechnen', result: 'Ergebnis', totalCost: 'Gesamtkosten', totalQty: 'Gesamtmenge', qtyToBuy: 'Kaufmenge', newTotal: 'Neue Summe', newAvg: 'Neuer Durchschnitt', theme: 'Design', language: 'Sprache', calculator: 'Rechner', buyingQty: 'Zu kaufende Menge', targetAvg2: 'Geschätzte Kosten' },
  pt: { title: 'Calculadora de Custos', heroTitle: 'Transforme Sua Perda em Lucro', heroDesc: 'Calcule o valor exato que você precisa comprar nos mercados de ações ou criptomoedas para reduzir seu custo em segundos.', currentQty: 'Qtd Atual', currentAvg: 'Média Atual', newPrice: 'Novo Preço', targetAvg: 'Média Alvo', calculate: 'Calcular', result: 'Resultado', totalCost: 'Custo Total', totalQty: 'Qtd Total', qtyToBuy: 'Qtd Comprar', newTotal: 'Novo Total', newAvg: 'Nova Média', theme: 'Tema', language: 'Idioma', calculator: 'Calculadora', buyingQty: 'Qtd a Comprar', targetAvg2: 'Custo Estimado' },
  zh: { title: '成本计算器', heroTitle: '将您的亏损转变为利润', heroDesc: '在股票或加密市场中计算您需要购买的确切金额以在几秒内降低成本', currentQty: '当前数量', currentAvg: '当前平均', newPrice: '新价格', targetAvg: '目标平均', calculate: '计算', result: '结果', totalCost: '总成本', totalQty: '总数量', qtyToBuy: '购买数量', newTotal: '新总额', newAvg: '新平均', theme: '主题', language: '语言', calculator: '计算器', buyingQty: '需购买数量', targetAvg2: '估计成本' },
  fr: { title: 'Calculatrice de Coût', heroTitle: 'Transformez Votre Perte en Profit', heroDesc: 'Calculez le montant exact que vous devez acheter sur les marchés boursiers ou de cryptomonnaies pour réduire votre coût en quelques secondes.', currentQty: 'Qté Actuelle', currentAvg: 'Moyenne Actuelle', newPrice: 'Nouveau Prix', targetAvg: 'Moyenne Cible', calculate: 'Calculer', result: 'Résultat', totalCost: 'Coût Total', totalQty: 'Qté Totale', qtyToBuy: 'Qté à Acheter', newTotal: 'Nouveau Total', newAvg: 'Nouvelle Moyenne', theme: 'Thème', language: 'Langue', calculator: 'Calculatrice', buyingQty: 'Qté à Acheter', targetAvg2: 'Coût Estimé' },
  it: { title: 'Calcolatore di Costi', heroTitle: 'Trasforma la Tua Perdita in Profitto', heroDesc: 'Calcola l\'importo esatto che devi acquistare sui mercati azionari o criptovalute per ridurre il costo in pochi secondi.', currentQty: 'Quantità Attuale', currentAvg: 'Media Attuale', newPrice: 'Nuovo Prezzo', targetAvg: 'Media Obiettivo', calculate: 'Calcola', result: 'Risultato', totalCost: 'Costo Totale', totalQty: 'Quantità Totale', qtyToBuy: 'Quantità da Acquistare', newTotal: 'Nuovo Totale', newAvg: 'Nuova Media', theme: 'Tema', language: 'Lingua', calculator: 'Calcolatore', buyingQty: 'Quantità da Acquistare', targetAvg2: 'Costo Stimato' },
};

const themes = [
  { name: 'Dark', bg: '#1a1a1a', card: '#2d2d2d', border: '#3d3d3d', text: '#ffffff', textSecond: '#b0b0b0', primary: '#3b82f6', accent: '#10b981', gradientStart: '#1e40af', gradientEnd: '#3b82f6' },
  { name: 'Light', bg: '#ffffff', card: '#f5f5f5', border: '#e0e0e0', text: '#000000', textSecond: '#666666', primary: '#2563eb', accent: '#10b981', gradientStart: '#1e40af', gradientEnd: '#3b82f6' },
];

export default function App() {
  const [themeIdx, setThemeIdx] = useState(1); // Light mode as default (index 1)
  const [lang, setLang] = useState('tr');
  const [currentQty, setCurrentQty] = useState('');
  const [currentAvg, setCurrentAvg] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [targetAvg, setTargetAvg] = useState('');
  const [result, setResult] = useState(null);
  const [showLangs, setShowLangs] = useState(false);

  const colors = themes[themeIdx];
  const t = translations[lang];

  const calculate = () => {
    if (!currentQty || !currentAvg || !newPrice || !targetAvg) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const cQty = parseFloat(currentQty);
    const cAvg = parseFloat(currentAvg);
    const nPrice = parseFloat(newPrice);
    const tAvg = parseFloat(targetAvg);

    if (cQty <= 0 || cAvg <= 0 || nPrice <= 0 || tAvg <= 0) {
      Alert.alert('Error', 'All values must be positive');
      return;
    }

    const totalCost = cQty * cAvg;
    // Solve: (totalCost + nPrice * Q) / (cQty + Q) = tAvg
    // totalCost + nPrice * Q = tAvg * (cQty + Q)
    // totalCost + nPrice * Q = tAvg * cQty + tAvg * Q
    // nPrice * Q - tAvg * Q = tAvg * cQty - totalCost
    // Q * (nPrice - tAvg) = tAvg * cQty - totalCost
    const qtyToBuy = (tAvg * cQty - totalCost) / (nPrice - tAvg);
    const qtyNeeded = cQty + qtyToBuy;
    const newTotalCost = totalCost + (nPrice * qtyToBuy);
    const newAverage = newTotalCost / qtyNeeded;

    setResult({
      totalCost: totalCost.toFixed(2),
      qtyNeeded: qtyNeeded.toFixed(2),
      qtyToBuy: qtyToBuy.toFixed(2),
      newAverage: newAverage.toFixed(2),
      totalNew: (nPrice * qtyToBuy).toFixed(2), // Cost of new purchases only
    });
  };

  const codes = ['tr', 'en', 'ar', 'de', 'pt', 'zh', 'fr', 'it'];
  const langNames = { tr: 'Türkçe', en: 'English', ar: 'العربية', de: 'Deutsch', pt: 'Português', zh: '中文', fr: 'Français', it: 'Italiano' };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={themeIdx === 1 ? 'dark-content' : 'light-content'} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => setThemeIdx(themeIdx === 0 ? 1 : 0)}
              style={[styles.btn, { backgroundColor: colors.primary }]}
            >
              <Ionicons name={themeIdx === 0 ? 'sunny' : 'moon'} size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{t.title}</Text>
          <TouchableOpacity
            onPress={() => setShowLangs(true)}
            style={[styles.langBtn, { borderColor: colors.primary }]}
          >
            <Ionicons name="chevron-down" size={16} color={colors.primary} />
            <Text style={[styles.langBtnText, { color: colors.primary }]}>{lang.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.heroContent}>
            <Text style={[styles.heroTitlePart1, { color: colors.text }]}>Zararınızı</Text>
            <View style={styles.heroTitleGradientContainer}>
              <Text style={[styles.heroTitlePart2, { color: colors.gradientEnd }]}>Kara</Text>
              <Text style={[styles.heroTitlePart2Space]} />
              <Text style={[styles.heroTitlePart2, { color: colors.gradientStart }]}>Dönüştürün</Text>
            </View>
            <Text style={[styles.heroDesc, { color: colors.textSecond }]}>{t.heroDesc}</Text>
          </View>
        </View>

        {/* Calculator Title */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.calculator}</Text>

        {/* Input Fields */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <InputField label={t.currentQty} value={currentQty} onChangeText={setCurrentQty} colors={colors} />
            </View>
            <View style={styles.inputHalf}>
              <InputField label={t.currentAvg} value={currentAvg} onChangeText={setCurrentAvg} colors={colors} />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <InputField label={t.newPrice} value={newPrice} onChangeText={setNewPrice} colors={colors} />
            </View>
            <View style={styles.inputHalf}>
              <InputField label={t.targetAvg} value={targetAvg} onChangeText={setTargetAvg} colors={colors} />
            </View>
          </View>

          <TouchableOpacity
            onPress={calculate}
            style={[styles.calculateBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={styles.calculateBtnText}>{t.calculate}</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {result && (
          <View style={[styles.resultCard, { backgroundColor: colors.primary }]}>
            <View style={styles.resultTopRow}>
              <View>
                <Text style={styles.resultLabel}>{t.buyingQty}</Text>
                <Text style={styles.resultMainValue}>{result.qtyToBuy}</Text>
              </View>
              <View style={styles.resultRight}>
                <Text style={[styles.resultSmallLabel, { color: colors.text }]}>{t.targetAvg2}</Text>
                <Text style={[styles.resultSmallValue, { color: colors.text }]}>${result.totalNew}</Text>
              </View>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultBottom}>
              <ResultRowWhite label={t.totalCost} value={`$${result.totalCost}`} />
              <ResultRowWhite label={t.newAvg} value={`$${result.newAverage}`} />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Language Selector */}
      <Modal visible={showLangs} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t.language}</Text>
            <FlatList
              data={codes}
              keyExtractor={code => code}
              renderItem={({ item: code }) => (
                <TouchableOpacity
                  onPress={() => {
                    setLang(code);
                    setShowLangs(false);
                  }}
                  style={[styles.themeItem, { borderBottomColor: colors.border, backgroundColor: lang === code ? colors.primary + '20' : 'transparent' }]}
                >
                  <Text style={[styles.themeText, { color: colors.text, fontWeight: lang === code ? 'bold' : 'normal' }]}>{langNames[code]}</Text>
                </TouchableOpacity>
              )}
              scrollEnabled={false}
            />
            <TouchableOpacity onPress={() => setShowLangs(false)} style={[styles.closeBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function InputField({ label, value, onChangeText, colors }) {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.textSecond }]}>{label}</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }]}
        placeholder="0"
        placeholderTextColor={colors.textSecond}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
      />
    </View>
  );
}

function ResultRow({ label, value, colors }) {
  return (
    <View style={styles.resultRow}>
      <Text style={[styles.resultLabel, { color: colors.textSecond }]}>{label}</Text>
      <Text style={[styles.resultValue, { color: colors.primary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: 20,
    marginBottom: 24,
    borderBottomWidth: 2,
  },
  headerLeft: {
    width: 48,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
    minWidth: 60,
    justifyContent: 'center',
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitlePart1: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  heroTitleGradientContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  heroTitlePart2: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroTitlePart2Space: {
    width: 8,
  },
  heroDesc: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputHalf: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  calculateBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  calculateBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  resultTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  resultLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  resultMainValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  resultRight: {
    alignItems: 'flex-end',
  },
  resultSmallLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  resultSmallValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  resultDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  resultBottom: {
    gap: 12,
  },
  resultRowWhite: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  resultLabelWhite: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  resultValueWhite: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#444',
  },
  resultLabel: {
    fontSize: 14,
  },
  resultValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    borderRadius: 12,
    maxHeight: '70%',
    width: '100%',
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    borderBottomWidth: 1,
  },
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  themeText: {
    fontSize: 14,
  },
  closeBtn: {
    padding: 12,
    alignItems: 'center',
    margin: 8,
    borderRadius: 8,
  },
  closeBtnText: {
    color: 'white',
    fontWeight: '600',
  },
});
