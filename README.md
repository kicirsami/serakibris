# Sera Kıbrıs 

Merhaba! Sera Kıbrıs, akıllı sera otomasyon sistemi bitki yetiştiriciliği için özel olarak tasarlanmış bir çözümdür. Projemiz, sera ortamında oluşan değişkenleri izleyip kontrol etmek için Arduino tabanlı sensörler ve bir mobil uygulama kullanmaktadır.

Arduino tabanlı sensörler, sera ortamındaki ışık, fan, su motoru, toprak nem seviyesi, sıcaklık ve nem gibi önemli parametreleri sürekli olarak ölçer. Mobil uygulama, bu sensörlerden alınan verileri gerçek zamanlı olarak kullanıcıya sunar ve kullanıcıların sera koşullarını uzaktan izlemesine ve kontrol etmesine olanak tanır.

Kullanıcılar, mobil uygulama aracılığıyla sera koşullarını takip edebilir, gerektiğinde ayarlamalar yapabilir ve otomatik kontrol özelliklerini kullanarak sera ortamını optimize edebilirler.
## Katkıda Bulunanlar
- [kicirsami] - Arduino geliştirme, mobil uygulama backend, API, Veritabanı ilişkileri
- [CodeWithMuzo] - Mobil uygulama Front geliştirmeleri
  
## İçindekiler

- [Kurulum](#kurulum)
- [Kullanım](#kullanım)
- [Katkıda Bulunma](#katkıda-bulunma)
- [İletişim](#iletişim)

## Kurulum

Bu projeyi kullanmaya başlamak için aşağıdaki adımları izleyin:

1. **XAMPP Kurulumu**:
   - Öncelikle [XAMPP](https://www.apachefriends.org/tr/index.html) web sitesinden XAMPP'ı indirin ve bilgisayarınıza kurun.

2. **Veritabanı Kurulumu**:
   - XAMPP'ı başlatın ve MySQL'i çalıştırın.
   - Tarayıcınızdan `http://localhost/phpmyadmin` adresine gidin ve phpMyAdmin arayüzünü açın.
   - Sol taraftaki menüden `Yeni` sekmesine tıklayarak yeni bir veritabanı oluşturun ve adını `sera` olarak belirleyin.
   - Oluşturduğunuz `sera` veritabanını seçin ve `İçe Aktar` sekmesine gidin.
   - `sera.sql` dosyasını seçin ve içe aktarın.

3. **Projeyi İndirme ve Ayarlama**:
   - Bu depoyu klonlayın:
     ```sh
     git clone https://github.com/kullanici_adi/proje_adi.git
     ```
   - İndirdiğiniz dosyaların içindeki `serakibris` ve `program` klasörlerini ayırın.

4. **VS Code veya Başka Bir IDE ile Açma**:
   - `serakibris` ve `program` klasörlerini VS Code veya tercih ettiğiniz bir IDE ile açın.

5. **Programı Başlatma**:
   - XAMPP'ı başlatın ve Apache ve MySQL'i çalıştırın.
   - `program` klasörü içinde terminali açın ve aşağıdaki komutu çalıştırarak programı başlatın:
     ```sh
     nodemon server.js
     ```

6. **Sera Uygulamasını Başlatma**:
   - `serakibris` klasörü içinde terminali açın ve aşağıdaki komutu çalıştırarak Ionic uygulamasını başlatın:
     ```sh
     ionic serve
     ```

Artık sistem hazır durumda! Tarayıcınız otomatik olarak açıldıktan sonra uygulamayı kullanmaya başlayabilirsiniz.


## Kullanım

Sistemi kullanmaya başlamak için aşağıdaki adımları izleyin:

1. **Giriş Yapma**:
   - Tarayıcınızda veya mobil cihazınızda uygulamayı başlatın.
   - Giriş yapma ekranında, kullanıcı adı ve şifrenizle oturum açın.

2. **Ana Ekranı Kullanma**:
   - Ana ekran, sera ortamındaki önemli verileri özetleyen bir kart (sera card) içerir. Bu karta tıkladığınızda, daha detaylı verileri görüntüleyebilirsiniz.

3. **Sera Ekleme**:
   - Ana ekranın üst kısmında, yeni bir sera eklemek için bir buton bulunur. Sadece yönetici olanlar bu butona tıklayabilir ve yeni sera ekleyebilir. Bu kısım da seranıza bir isim ve bir rsim ekleyebilirsiniz.
  
4. **Chat Kullanımı**:
   - Ayrıca, "Chat" sekmesine tıklayarak bize veya yöneticinize bir şey danışabilirsiniz.

5. **Profil Yönetimi**:
   - Nav barda bulunan "Profil" butonuna tıklayarak kendi profilinizi görüntüleyebilirsiniz. Buradan profililim sekmesinden bilgilerinizi değiştirebilir veya görüntüleyebilirsiniz.

6. **Çalışan Ekleme ve Ekibim**:
   - Yönetici olarak giriş yaptıysanız, "Çalışan Ekle" butonuna tıklayarak yeni çalışanlar ekleyebilirsiniz. Eklediğiniz çalışanları "Ekibim" sekmesinden görüntüleyebilirsiniz.
   - Çalışanlar, kendi ekibindeki diğer çalışanları ve yöneticisini "Ekip Arkadaşlarım" sekmesinden görebilirler. (Eğer çalışan olarak giriş yapmışsanız "Ekibim" sekmesi "Ekip Arkadaşlarım" olarak değişir.)

7. **Çıkış Yapma**:
   - Kullanımınızı tamamladıktan sonra, uygulamadan çıkmak için "Çıkış Yap" butonuna tıklayın.

Bu adımları takip ederek, sistemi etkin bir şekilde kullanabilir ve sera ortamınızı kontrol edebilirsiniz.


## Katkıda Bulunma

Bu projeye katkıda bulunmak istiyorsanız, aşağıdaki adımları izleyebilirsiniz:

1. **Fork Edin**:
   - Bu depoyu fork ederek kendi GitHub hesabınıza kopyalayın.

2. **Yeni Dal Oluşturun**:
   - Yeni bir dal (branch) oluşturun:
     ```sh
     git checkout -b yeni-ozellik
     ```

3. **Değişiklikleri Yapın**:
   - Kod tabanında istediğiniz değişiklikleri yapın.

4. **Değişiklikleri Yayınlayın**:
   - Değişikliklerinizi commit edin:
     ```sh
     git commit -m 'Yeni özellik ekle'
     ```
   - Yeni dali (branch) kendi forked depoya (repository) push edin:
     ```sh
     git push origin yeni-ozellik
     ```

5. **Pull Request (Çekme İsteği) Oluşturun**:
   - GitHub hesabınızdaki forked depoya gidin ve "Pull Request" butonuna tıklayarak bir çekme isteği oluşturun.

6. **Geri Bildirim Alın**:
   - Proje sahibi veya katkıda bulunanlar, değişikliklerinizi inceleyecek ve gerekli geri bildirimleri sağlayacaktır.

7. **Geliştirin ve İyileştirin**:
   - Geliştirme sürecine katılarak projeyi daha iyi bir hale getirebilirsiniz.

Her türlü katkıya açığız! Projeye katkıda bulunan herkese teşekkür ederiz.


## İletişim

Herhangi bir sorunuz, öneriniz veya geri bildiriminiz varsa, bize ulaşmaktan çekinmeyin:

- Proje sahibi: [kicirsami](https://github.com/kicirsami),[CodeWithMuzo](https://github.com/CodeWithMuzo)
- E-posta: [kicirsami06@gmail.com](mailto:kicirsami06@gmail.com),[muzafferkhan571.1571@gmail.com](mailto:muzafferkhan571.1571@gmail.com)
- Sera Kıbrıs E-posta: [serakibris@outlook.com](mailto:serakibris@outlook.com)

Ayrıca, projenin GitHub sayfasını ziyaret ederek diğer katkıda bulunanlarla iletişime geçebilir ve proje hakkında daha fazla bilgi edinebilirsiniz.






