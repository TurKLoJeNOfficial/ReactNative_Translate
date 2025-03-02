import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    Platform,
    StatusBar,
    ActivityIndicator,
    Modal,
    FlatList,
    Alert,
    Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translateText } from '../services/translationService';

const { width } = Dimensions.get('window');

// Geçmiş için storage anahtarı
const HISTORY_STORAGE_KEY = '@translation_history';

const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'az', name: 'Azerice', flag: '🇦🇿' },
    { code: 'uz', name: 'Özbekçe', flag: '🇺🇿' },
    { code: 'kk', name: 'Kazakça', flag: '🇰🇿' },
    { code: 'ky', name: 'Kırgızca', flag: '🇰🇬' },
    { code: 'tk', name: 'Türkmence', flag: '🇹🇲' },
    { code: 'en', name: 'İngilizce', flag: '🇬🇧' },
    { code: 'es', name: 'İspanyolca', flag: '🇪🇸' },
    { code: 'fr', name: 'Fransızca', flag: '🇫🇷' },
    { code: 'de', name: 'Almanca', flag: '🇩🇪' },
    { code: 'it', name: 'İtalyanca', flag: '🇮🇹' },
    { code: 'pt', name: 'Portekizce', flag: '🇵🇹' },
    { code: 'ru', name: 'Rusça', flag: '🇷🇺' },
    { code: 'ja', name: 'Japonca', flag: '🇯🇵' },
    { code: 'ko', name: 'Korece', flag: '🇰🇷' },
    { code: 'zh', name: 'Çince', flag: '🇨🇳' },
    { code: 'ar', name: 'Arapça', flag: '🇸🇦' },
    { code: 'hi', name: 'Hintçe', flag: '🇮🇳' },
    { code: 'el', name: 'Yunanca', flag: '🇬🇷' },
    { code: 'nl', name: 'Hollandaca', flag: '🇳🇱' },
    { code: 'pl', name: 'Lehçe', flag: '🇵🇱' },
    { code: 'vi', name: 'Vietnamca', flag: '🇻🇳' },
    { code: 'th', name: 'Tayca', flag: '🇹🇭' },
    { code: 'sv', name: 'İsveççe', flag: '🇸🇪' },
    { code: 'da', name: 'Danca', flag: '🇩🇰' },
    { code: 'fi', name: 'Fince', flag: '🇫🇮' },
    { code: 'no', name: 'Norveççe', flag: '🇳🇴' },
    { code: 'cs', name: 'Çekçe', flag: '🇨🇿' },
    { code: 'hu', name: 'Macarca', flag: '🇭🇺' },
    { code: 'ro', name: 'Romence', flag: '🇷🇴' },
    { code: 'bg', name: 'Bulgarca', flag: '🇧🇬' },
    { code: 'uk', name: 'Ukraynaca', flag: '🇺🇦' },
    { code: 'he', name: 'İbranice', flag: '🇮🇱' },
    { code: 'id', name: 'Endonezce', flag: '🇮🇩' },
    { code: 'ms', name: 'Malayca', flag: '🇲🇾' },
    { code: 'fa', name: 'Farsça', flag: '🇮🇷' },
    { code: 'bn', name: 'Bengalce', flag: '🇧🇩' },
    { code: 'ur', name: 'Urduca', flag: '🇵🇰' },
    { code: 'ta', name: 'Tamilce', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'si', name: 'Sinhala', flag: '🇱🇰' },
    { code: 'km', name: 'Kmerce', flag: '🇰🇭' },
    { code: 'my', name: 'Birmanca', flag: '🇲🇲' },
    { code: 'ka', name: 'Gürcüce', flag: '🇬🇪' },
    { code: 'am', name: 'Amharca', flag: '🇪🇹' },
    { code: 'sw', name: 'Svahili', flag: '🇹🇿' },
    { code: 'af', name: 'Afrikaanca', flag: '🇿🇦' },
    { code: 'la', name: 'Latince', flag: '🏛️' },
    { code: 'cy', name: 'Galce', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
    { code: 'ga', name: 'İrlandaca', flag: '🇮🇪' },
    { code: 'is', name: 'İzlandaca', flag: '🇮🇸' }
];

const HomeScreen = () => {
    const [sourceLanguage, setSourceLanguage] = useState('tr');
    const [targetLanguage, setTargetLanguage] = useState('en');
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [isSelectingSource, setIsSelectingSource] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [history, setHistory] = useState([]);

    const filteredLanguages = languages.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Uygulama başladığında geçmişi yükle
    useEffect(() => {
        loadHistory();
    }, []);

    // Geçmişi AsyncStorage'dan yükle
    const loadHistory = async () => {
        try {
            const savedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error('Geçmiş yüklenirken hata oluştu:', error);
        }
    };

    // Geçmişi AsyncStorage'a kaydet
    const saveHistory = async (newHistory) => {
        try {
            await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
        } catch (error) {
            console.error('Geçmiş kaydedilirken hata oluştu:', error);
        }
    };

    const handleLanguageSelect = (langCode) => {
        if (isSelectingSource) {
            setSourceLanguage(langCode);
        } else {
            setTargetLanguage(langCode);
        }
        setShowLanguageModal(false);
        setSearchQuery('');
    };

    const openLanguageModal = (isSource) => {
        setIsSelectingSource(isSource);
        setShowLanguageModal(true);
    };

    const handleSwapLanguages = () => {
        const tempLang = sourceLanguage;
        setSourceLanguage(targetLanguage);
        setTargetLanguage(tempLang);
    };

    const handleTranslation = async () => {
        if (!sourceText.trim()) return;

        setIsTranslating(true);
        setTranslatedText('');  // Önceki çeviriyi temizle

        try {
            const sourceLangName = languages.find(l => l.code === sourceLanguage)?.name;
            const targetLangName = languages.find(l => l.code === targetLanguage)?.name;

            console.log('Starting translation:', {
                text: sourceText,
                from: sourceLangName,
                to: targetLangName
            });

            const result = await translateText(
                sourceText,
                sourceLangName,
                targetLangName
            );

            if (result) {
                setTranslatedText(result);
                // Geçmişe ekle ve kaydet
                const newHistory = [{
                    source: sourceText,
                    target: result,
                    sourceLang: sourceLangName,
                    targetLang: targetLangName,
                    date: new Date().toISOString()
                }, ...history.slice(0, 49)]; // Son 50 çeviriyi tut
                setHistory(newHistory);
                saveHistory(newHistory);
            } else {
                setTranslatedText('Çeviri sonucu boş geldi');
            }
        } catch (error) {
            console.error('Translation error in component:', error);
            setTranslatedText(error.message || 'Çeviri sırasında bir hata oluştu');
        } finally {
            setIsTranslating(false);
        }
    };

    // Çevrilen metni panoya kopyalama
    const handleCopyText = () => {
        if (!translatedText.trim()) {
            Alert.alert('Uyarı', 'Kopyalanacak çevrilmiş metin bulunamadı.');
            return;
        }

        Clipboard.setString(translatedText);
        Alert.alert('Başarılı', 'Çevrilen metin panoya kopyalandı.');
    };

    // Geçmiş öğesini silme fonksiyonu
    const handleDeleteHistoryItem = (index) => {
        // Silme işlemi onay mesajı göster
        Alert.alert(
            'Onay',
            'Bu çeviriyi geçmişten silmek istediğinize emin misiniz?',
            [
                {
                    text: 'İptal',
                    style: 'cancel'
                },
                {
                    text: 'Sil',
                    onPress: () => {
                        // Yeni geçmiş dizisini oluştur (silinecek öğeyi çıkart)
                        const newHistory = [...history];
                        newHistory.splice(index, 1);

                        // State güncelle
                        setHistory(newHistory);

                        // AsyncStorage'a kaydet
                        saveHistory(newHistory);

                        // Bildirim göster
                        Alert.alert('Başarılı', 'Çeviri geçmişten silindi.');
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#2196F3" barStyle="light-content" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.languageRow}>
                        <TouchableOpacity
                            style={styles.languageButton}
                            onPress={() => openLanguageModal(true)}
                        >
                            <Text style={styles.languageFlag}>
                                {languages.find(l => l.code === sourceLanguage)?.flag}
                            </Text>
                            <Text style={styles.languageText}>
                                {languages.find(l => l.code === sourceLanguage)?.name}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.swapButton} onPress={handleSwapLanguages}>
                            <Ionicons name="swap-horizontal" size={24} color="white" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.languageButton}
                            onPress={() => openLanguageModal(false)}
                        >
                            <Text style={styles.languageFlag}>
                                {languages.find(l => l.code === targetLanguage)?.flag}
                            </Text>
                            <Text style={styles.languageText}>
                                {languages.find(l => l.code === targetLanguage)?.name}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.translationCard}>
                        <View style={styles.inputSection}>
                            <TextInput
                                style={styles.textInput}
                                multiline
                                placeholder="Çevirmek istediğiniz metni girin..."
                                placeholderTextColor="#999"
                                value={sourceText}
                                onChangeText={setSourceText}
                            />
                            <View style={styles.inputActions}>
                                <TouchableOpacity
                                    style={[styles.translateButton, !sourceText.trim() && styles.translateButtonDisabled]}
                                    onPress={handleTranslation}
                                    disabled={!sourceText.trim() || isTranslating}
                                >
                                    {isTranslating ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <Text style={styles.translateButtonText}>Çevir</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.outputSection}>
                            <Text style={[styles.translatedText, !translatedText && styles.placeholderText]}>
                                {translatedText || 'Çeviri burada görünecek...'}
                            </Text>
                            <View style={styles.outputActions}>
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={handleCopyText}
                                >
                                    <Ionicons name="copy-outline" size={22} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.historyContainer}>
                        <View style={styles.historyHeader}>
                            <Text style={styles.historyTitle}>Geçmiş</Text>
                            <TouchableOpacity>
                                <Text style={styles.historyMore}>daha fazla</Text>
                            </TouchableOpacity>
                        </View>
                        {history.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.historyItem}>
                                <View style={styles.historyItemHeader}>
                                    <Text style={styles.historyDate}>
                                        {new Date(item.date).toLocaleDateString('tr-TR')}
                                    </Text>
                                    <View style={styles.historyItemActions}>
                                        <Text style={styles.historyLanguages}>
                                            {item.sourceLang} → {item.targetLang}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.historyDeleteButton}
                                            onPress={() => handleDeleteHistoryItem(index)}
                                        >
                                            <Ionicons name="trash-outline" size={18} color="#FF5252" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={styles.historySource}>{item.source}</Text>
                                <Text style={styles.historyTarget}>{item.target}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.wave}>
                    <View style={styles.waveShape} />
                </View>

                <Modal
                    visible={showLanguageModal}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {isSelectingSource ? 'Kaynak Dil Seçin' : 'Hedef Dil Seçin'}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowLanguageModal(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <Ionicons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            <TextInput
                                style={styles.searchInput}
                                placeholder="Dil ara..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />

                            <FlatList
                                data={filteredLanguages}
                                keyExtractor={(item) => item.code}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.languageItem}
                                        onPress={() => handleLanguageSelect(item.code)}
                                    >
                                        <View style={styles.languageItemContent}>
                                            <Text style={styles.languageFlag}>{item.flag}</Text>
                                            <Text style={styles.languageItemText}>{item.name}</Text>
                                        </View>
                                        {((isSelectingSource && item.code === sourceLanguage) ||
                                            (!isSelectingSource && item.code === targetLanguage)) && (
                                                <Ionicons name="checkmark" size={24} color="#2196F3" />
                                            )}
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2196F3',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    languageRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 16,
    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        minWidth: 120,
    },
    languageText: {
        color: 'white',
        fontSize: 16,
        marginRight: 8,
    },
    swapButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        marginHorizontal: 8,
    },
    content: {
        flex: 1,
    },
    translationCard: {
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    inputSection: {
        padding: 16,
    },
    textInput: {
        fontSize: 18,
        minHeight: 100,
        textAlignVertical: 'top',
        color: '#333',
    },
    inputActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginHorizontal: 16,
    },
    outputSection: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    translatedText: {
        fontSize: 18,
        color: '#333',
        minHeight: 60,
    },
    placeholderText: {
        color: '#999',
    },
    outputActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
    },
    actionButton: {
        padding: 8,
        marginRight: 8,
    },
    historyContainer: {
        padding: 16,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    historyMore: {
        color: '#2196F3',
    },
    historyItem: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    historyItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    historyItemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyDeleteButton: {
        marginLeft: 10,
        padding: 5,
    },
    historyDate: {
        fontSize: 14,
        color: '#666',
    },
    historyLanguages: {
        fontSize: 14,
        color: '#666',
    },
    historySource: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    historyTarget: {
        fontSize: 16,
        color: '#666',
    },
    wave: {
        height: 50,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    waveShape: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#E3F2FD',
        borderTopLeftRadius: 1000,
        borderTopRightRadius: 1000,
        transform: [{ scaleX: 2 }],
    },
    translateButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 12,
    },
    translateButtonDisabled: {
        backgroundColor: '#B0BEC5',
    },
    translateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: Platform.OS === 'ios' ? 40 : 0,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    searchInput: {
        margin: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        fontSize: 16,
    },
    languageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    languageItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    languageFlag: {
        fontSize: 24,
        marginRight: 8,
    },
    languageItemText: {
        fontSize: 16,
        color: '#333',
    }
});

export default HomeScreen; 