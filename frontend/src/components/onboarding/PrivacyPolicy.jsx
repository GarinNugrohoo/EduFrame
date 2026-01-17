import { ArrowLeftIcon } from "../icons/IkonWrapper";
import logo from "../../assets/EduFrame.png";

const PrivacyPolicy = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="text-base md:text-lg font-medium">Kembali</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-12 md:h-12  flex items-center justify-center">
              <img src={logo} alt="" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              EduFrame
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center">
            Kebijakan Privasi
          </h1>

          <div className="text-sm text-gray-500 text-center mb-8">
            Terakhir diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            {/* Introduction */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                1. Pengantar
              </h2>
              <p>
                Kebijakan Privasi ini menjelaskan bagaimana EduFrame
                mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda
                saat menggunakan platform pembelajaran kami. Kami berkomitmen
                untuk melindungi privasi dan keamanan data Anda.
              </p>
            </section>

            {/* Data Collection */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                2. Data yang Kami Kumpulkan
              </h2>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Data yang Anda Berikan:
                  </h3>
                  <ul className="space-y-1 list-disc pl-5">
                    <li>Informasi pendaftaran (nama, email, password)</li>
                    <li>Riwayat pembelajaran dan progress</li>
                    {/* <li>Konten yang Anda unggah atau buat</li> */}
                  </ul>
                </div>

                {/* <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Data Otomatis:
                  </h3>
                  <ul className="space-y-1 list-disc pl-5">
                    <li>Informasi perangkat (tipe, sistem operasi)</li>
                    <li>Lokasi umum (negara, kota)</li>
                    <li>
                      Log aktivitas (waktu akses, halaman yang dikunjungi)
                    </li>
                    <li>Data kinerja platform</li>
                  </ul>
                </div> */}
              </div>
            </section>

            {/* Data Usage */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                3. Penggunaan Data
              </h2>
              <p className="mb-4">Kami menggunakan data Anda untuk:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Menyediakan dan memelihara platform pembelajaran</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Memproses pendaftaran dan mengelola akun Anda</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Memperbaiki dan meningkatkan pengalaman belajar</span>
                </li>
                {/* <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Mengirim notifikasi dan pembaruan penting</span>
                </li> */}
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>
                    Analisis dan penelitian untuk pengembangan platform
                  </span>
                </li>
              </ul>
            </section>

            {/* Data Protection */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                4. Perlindungan Data
              </h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <p className="text-yellow-800">
                    <strong>Keamanan:</strong> Kami menggunakan teknologi
                    enkripsi SSL untuk melindungi data transmisi dan menerapkan
                    standar keamanan industri untuk penyimpanan data.
                  </p>
                </div>

                <p>
                  Meskipun kami telah menerapkan langkah-langkah keamanan yang
                  wajar, tidak ada metode transmisi melalui internet atau
                  penyimpanan elektronik yang 100% aman.
                </p>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                5. Berbagi Data
              </h2>
              <p className="mb-4">
                Kami tidak menjual atau menyewakan data pribadi Anda kepada
                pihak ketiga. Data dapat dibagikan dengan:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Penyedia layanan yang membantu operasional platform</li>
                {/* <li>Pihak berwenang jika diwajibkan oleh hukum</li>
                <li>
                  Mitra yang menyediakan layanan tambahan (dengan persetujuan
                  Anda)
                </li> */}
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                6. Hak Anda
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hak Akses
                  </h3>
                  <p className="text-sm">
                    Anda dapat mengakses data pribadi Anda melalui pengaturan
                    akun
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hak Perbaikan
                  </h3>
                  <p className="text-sm">
                    Anda dapat memperbaiki data yang tidak akurat
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hak Penghapusan
                  </h3>
                  <p className="text-sm">
                    Anda dapat meminta penghapusan data pribadi
                  </p>
                </div>
                {/* <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Hak Pembatasan
                  </h3>
                  <p className="text-sm">
                    Anda dapat membatasi pemrosesan data Anda
                  </p>
                </div> */}
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                7. Cookies dan Teknologi Pelacakan
              </h2>
              <div className="space-y-3">
                <p>Kami menggunakan cookies untuk:</p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Mengingat preferensi Anda</li>
                  <li>Menganalisis penggunaan platform</li>
                  <li>Meningkatkan keamanan</li>
                  <li>Menyediakan fitur personalisasi</li>
                </ul>
                <p>
                  Anda dapat mengontrol cookies melalui pengaturan browser Anda.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                8. Privasi Anak
              </h2>
              <div className="bg-red-50 rounded-xl p-4">
                <p>
                  Platform kami tidak ditujukan untuk anak di bawah 13 tahun.
                  Kami tidak secara sadar mengumpulkan data pribadi dari anak di
                  bawah 13 tahun. Jika Anda orang tua atau wali dan mengetahui
                  bahwa anak Anda telah memberikan data kepada kami, harap
                  hubungi kami.
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                9. Perubahan Kebijakan Privasi
              </h2>
              <p>
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke
                waktu. Perubahan akan diberitahukan melalui platform atau email.
                Dengan terus menggunakan layanan kami setelah perubahan, Anda
                menyetujui kebijakan yang diperbarui.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-blue-50 rounded-xl p-6 md:p-8 mt-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                Kontak dan Dukungan Privasi
              </h2>
              <div className="space-y-4">
                <p>
                  Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini
                  atau ingin melaksanakan hak privasi Anda, silakan hubungi:
                </p>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Petugas Privasi:</span>
                    <span>Tim Keamanan Data EduFrame</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <a
                      href="mailto:privacy@eduframe.com"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      privacy@eduframe.com
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-medium">Waktu Respon:</span>
                    <span>7-14 hari kerja</span>
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Compliance */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Kepatuhan Regulasi
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Kami berkomitmen untuk mematuhi undang-undang perlindungan
                    data yang berlaku, termasuk UU No. 27 Tahun 2022 tentang
                    Perlindungan Data Pribadi.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      99.9%
                    </div>
                    <div className="text-xs text-gray-600">Uptime Platform</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      256-bit
                    </div>
                    <div className="text-xs text-gray-600">Enkripsi SSL</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} EduFrame Learning Platform. Kami peduli
            dengan privasi Anda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
