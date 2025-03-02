# ReactNative Translate App

Bu proje, modern React Native geliştirme pratiklerini ve en iyi uygulamaları kullanarak geliştirilmiş, kullanıcı dostu bir çeviri uygulamasıdır. Proje, yapay zeka destekli çeviri yapmaktadır. Yapay zeka olarak ise Gemini kullanılmaktadır.

## 📷 Screenshots

<p>
  <img src="https://github.com/user-attachments/assets/fa57381d-ee1d-41c8-b496-b873db16da22"  width="200"/>
  <img src="https://github.com/user-attachments/assets/108aa85f-a6c2-408a-b24f-765d3b8bbdaa" width="200"/>
  <img src="https://github.com/user-attachments/assets/a73687dd-8af8-4707-a56b-b2ec3f4f9e04" width="200"/>

## 📱 Özellikler

- **Çoklu Dil Desteği**: Türkçe, İngilizce, Almanca, Fransızca, İspanyolca dahil 50+ dil desteği
- **Kolay Arayüz**: Basit ve kullanıcı dostu tasarım
- **Hızlı Dil Değiştirme**: Tek dokunuşla kaynak ve hedef dil arasında geçiş yapabilme
- **Çeviri Geçmişi**: Yapılan çeviriler otomatik olarak kaydedilir
- **Metin Kopyalama**: Çevrilmiş metni tek dokunuşla panoya kopyalama
- **Geçmiş Yönetimi**: İstenmeyen çevirileri geçmişten silme imkanı

## 🛠️ Kullanılan Teknolojiler

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

## 🚀 Kurulum

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1. Bilgisayarınızda Node.js ve npm'in kurulu olduğundan emin olun
2. Expo CLI'yi yükleyin: `npm install -g expo-cli`
3. Projeyi klonlayın:
   ```bash
   git clone https://github.com/kullanici-adi/AlphaTranslate.git
   cd AlphaTranslate
   ```
4. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
5. Uygulamayı başlatın:
   ```bash
   expo start
   ```
6. Expo Go uygulamasını kullanarak mobil cihazınızda testi yapabilir veya emülatör kullanabilirsiniz

## 📖 Kullanım

1. **Çeviri Yapma**:
   - Kaynak dili seçin
   - Hedef dili seçin
   - Çevirmek istediğiniz metni girin
   - "Çevir" butonuna tıklayın

2. **Dil Değiştirme**:
   - Dil seçim butonlarına tıklayarak kaynak veya hedef dil seçebilirsiniz
   - Ortadaki çift yönlü ok ile kaynak ve hedef dilleri hızlıca değiştirebilirsiniz

3. **Çeviriyi Kopyalama**:
   - Çeviri tamamlandıktan sonra çevrilen metin alanının altındaki kopyalama ikonuna tıklayın
   - Metin otomatik olarak panoya kopyalanacaktır

4. **Geçmiş İşlemleri**:
   - Tüm çevirileriniz ana ekranın alt kısmında geçmiş bölümünde listelenir
   - Geçmişteki bir çeviriyi silmek için çöp kutusu ikonuna tıklayın
