import { ArrowLeftIcon, CheckIcon, GraduationIcon } from "../icons/IkonWrapper";
import logo from "../../assets/EduFrame.png";

const TermsConditions = ({ onBack }) => {
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
            <div className="w-10 h-10 md:w-12 md:h-12  flex items-center justify-center">
              <img src={logo} alt="" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-gray-900">
              EduFrame
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg p-6 md:p-8 lg:p-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center">
            Syarat dan Ketentuan Penggunaan
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
            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                1. Penerimaan Syarat
              </h2>
              <p className="mb-4">
                Dengan mengakses dan menggunakan platform EduFrame, Anda setuju
                untuk terikat oleh syarat dan ketentuan ini. Jika Anda tidak
                setuju dengan syarat dan ketentuan ini, harap hentikan
                penggunaan platform ini.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                2. Pendaftaran Akun
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span>
                    Anda harus berusia minimal 13 tahun untuk membuat akun
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span>
                    Informasi yang Anda berikan saat pendaftaran harus akurat
                    dan lengkap
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span>
                    Anda bertanggung jawab untuk menjaga kerahasiaan akun dan
                    password Anda
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                  <span>
                    Satu pengguna hanya diperbolehkan memiliki satu akun
                  </span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                3. Panduan Penggunaan
              </h2>
              <p className="mb-4">Anda setuju untuk tidak:</p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Menggunakan platform untuk tujuan ilegal atau tidak sah</li>
                <li>Mengganggu atau mencoba mengganggu keamanan platform</li>
                <li>
                  Mengunggah konten yang mengandung virus atau kode berbahaya
                </li>
                <li>
                  Melakukan scraping atau mengumpulkan data pengguna tanpa izin
                </li>
                <li>Menggunakan akun orang lain tanpa izin</li>
                <li>Menyebarkan konten yang melanggar hak cipta</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                4. Hak Kekayaan Intelektual
              </h2>
              <p className="mb-4">
                Semua materi pembelajaran, termasuk teks, gambar, video, dan
                kode yang tersedia di EduFrame dilindungi oleh hak cipta.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Hak Pengguna:
                </h3>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Mengakses materi untuk pembelajaran pribadi</li>
                  <li>
                    Mendownload materi yang diperbolehkan untuk penggunaan
                    offline
                  </li>
                  <li>
                    Menggunakan materi untuk tujuan pendidikan non-komersial
                  </li>
                </ul>
              </div>
            </section>

            {/* <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                5. Langganan dan Pembayaran
              </h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <p className="text-yellow-800">
                    <strong>Penting:</strong> Beberapa fitur mungkin memerlukan
                    langganan berbayar. Pembayaran yang sudah dilakukan tidak
                    dapat dikembalikan kecuali ada kesalahan teknis dari pihak
                    kami.
                  </p>
                </div>
                <p>
                  Kami berhak untuk mengubah harga langganan dengan
                  pemberitahuan 30 hari sebelumnya. Pembaruan langganan akan
                  dilakukan secara otomatis kecuali Anda membatalkannya.
                </p>
              </div>
            </section> */}

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                5. Penghentian Akun
              </h2>
              <p className="mb-4">
                Kami berhak untuk menghentikan atau menangguhkan akun Anda jika:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>Melanggar syarat dan ketentuan ini</li>
                <li>Melakukan aktivitas yang mencurigakan atau berbahaya</li>
                <li>Memberikan informasi palsu saat pendaftaran</li>
                <li>Tidak aktif selama lebih dari 12 bulan</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                6. Penafian
              </h2>
              <div className="space-y-3">
                <p>
                  Platform EduFrame disediakan "sebagaimana adanya". Kami tidak
                  menjamin bahwa:
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Platform akan selalu tersedia tanpa gangguan</li>
                  <li>Materi pembelajaran bebas dari kesalahan</li>
                  <li>Platform akan aman dari serangan siber</li>
                  <li>Hasil pembelajaran dapat dijamin</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                7. Perubahan Syarat dan Ketentuan
              </h2>
              <p>
                Kami dapat memperbarui syarat dan ketentuan ini dari waktu ke
                waktu. Perubahan akan diberitahukan melalui email atau
                notifikasi di platform. Dengan terus menggunakan platform
                setelah perubahan, Anda setuju dengan syarat dan ketentuan yang
                diperbarui.
              </p>
            </section>

            <section className="bg-gray-50 rounded-xl p-6 md:p-8 mt-8">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                Kontak
              </h2>
              <p className="mb-4">
                Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini,
                silakan hubungi kami:
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-medium">Email:</span>
                  <a
                    href="mailto:garinnugroho0912@gmail.com"
                    className="text-red-600 hover:text-red-700"
                  >
                    garinnugroho0912@gmail.com
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Alamat:</span>
                  <span>SMAN 1 Gedeg</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">Jam Operasional:</span>
                  <span>Senin - Jumat, 09:00 - 17:00 WIB</span>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-200">
            <div className="bg-green-50 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Konfirmasi Pemahaman
              </h3>
              <p className="text-gray-700">
                Dengan menggunakan platform EduFrame, Anda mengakui bahwa Anda
                telah membaca, memahami, dan menyetujui Syarat dan Ketentuan
                ini.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} EduFrame Learning Platform. Semua hak
            dilindungi undang-undang.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
