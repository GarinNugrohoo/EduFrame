const fs = require("fs").promises;
const path = require("path");
const schedule = require("node-schedule");

class AutoApiKey {
  constructor() {
    this.filePath = path.join(__dirname, "../../data/auto_api_keys.json");
    this.keys = [];
    this.jobs = new Map();
    this.init();
  }

  // Inisialisasi: baca data dan setup ulang schedule
  async init() {
    try {
      const data = await fs.readFile(this.filePath, "utf8");
      this.keys = JSON.parse(data);
      console.log(`Data ${this.keys.length} API keys berhasil dimuat`);
      this.restoreScheduledJobs();
    } catch (error) {
      this.keys = [];
      await this.saveToFile();
      console.log("File API keys baru dibuat");
    }
  }

  // Buat API key dengan auto update
  async buatKeyAutoUpdate(nama = "default", hariUpdate = 7) {
    try {
      const apiKey = this.generateKey();
      const sekarang = new Date();
      const tanggalKadaluarsa = new Date(sekarang);
      tanggalKadaluarsa.setDate(sekarang.getDate() + hariUpdate);

      const dataKey = {
        id: `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        nama: nama,
        key: apiKey,
        dibuat: sekarang.toISOString(),
        kadaluarsa: tanggalKadaluarsa.toISOString(),
        hariUpdate: hariUpdate,
        aktif: true,
        riwayat: [],
        updateBerikutnya: tanggalKadaluarsa.toISOString(),
      };

      this.keys.push(dataKey);
      this.jadwalkanUpdate(dataKey.id, hariUpdate);
      await this.saveToFile();

      return {
        sukses: true,
        id: dataKey.id,
        apiKey: apiKey,
        kadaluarsa: tanggalKadaluarsa.toISOString(),
        hariUpdate: hariUpdate,
        pesan: `API key akan auto-update setiap ${hariUpdate} hari`,
      };
    } catch (error) {
      console.error("Gagal buat API key:", error);
      throw error;
    }
  }

  // Generate key acak
  generateKey(panjang = 32) {
    const karakter =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let hasil = "";

    for (let i = 0; i < panjang; i++) {
      const indexAcak = Math.floor(Math.random() * karakter.length);
      hasil += karakter.charAt(indexAcak);
    }

    return `sk_${hasil}`;
  }

  // Jadwalkan auto update
  jadwalkanUpdate(keyId, hariUpdate) {
    const rule = new schedule.RecurrenceRule();
    rule.hour = 0;
    rule.minute = 0;

    const job = schedule.scheduleJob(rule, async () => {
      await this.updateKeyOtomatis(keyId);
    });

    this.jobs.set(keyId, job);
    console.log(`Jadwal update untuk key ${keyId} setiap ${hariUpdate} hari`);
  }

  // Update key secara otomatis
  async updateKeyOtomatis(keyId) {
    try {
      const keyIndex = this.keys.findIndex((k) => k.id === keyId);

      if (keyIndex === -1 || !this.keys[keyIndex].aktif) {
        console.log(`Key ${keyId} tidak ditemukan atau tidak aktif`);
        return;
      }

      const keyLama = this.keys[keyIndex];

      // Simpan key lama ke riwayat
      keyLama.riwayat.push({
        key: keyLama.key,
        digunakanSampai: new Date().toISOString(),
      });

      // Generate key baru
      const keyBaru = this.generateKey();

      // Update data key
      const sekarang = new Date();
      const tanggalUpdateBerikutnya = new Date(sekarang);
      tanggalUpdateBerikutnya.setDate(sekarang.getDate() + keyLama.hariUpdate);

      this.keys[keyIndex].key = keyBaru;
      this.keys[keyIndex].kadaluarsa = tanggalUpdateBerikutnya.toISOString();
      this.keys[keyIndex].updateBerikutnya =
        tanggalUpdateBerikutnya.toISOString();
      this.keys[keyIndex].terakhirDiupdate = sekarang.toISOString();

      await this.saveToFile();

      console.log(`Key ${keyId} berhasil diupdate otomatis`);
      console.log(`Key baru: ${keyBaru.substring(0, 10)}...`);

      // Kirim notifikasi (implementasi tergantung kebutuhan)
      this.kirimNotifikasiUpdate(keyLama.userId, keyId, keyBaru);
    } catch (error) {
      console.error("Gagal update key otomatis:", error);
    }
  }

  // Update manual sebelum waktunya
  async updateKeyManual(keyId, userId) {
    try {
      const keyIndex = this.keys.findIndex(
        (k) => k.id === keyId && k.userId === userId && k.aktif === true
      );

      if (keyIndex === -1) {
        return { sukses: false, pesan: "Key tidak ditemukan" };
      }

      await this.updateKeyOtomatis(keyId);

      return {
        sukses: true,
        pesan: "Key berhasil diupdate manual",
        keyBaru: this.keys[keyIndex].key,
      };
    } catch (error) {
      console.error("Gagal update manual:", error);
      throw error;
    }
  }

  // Ubah jadwal update
  async ubahJadwalUpdate(keyId, userId, hariBaru) {
    try {
      const keyIndex = this.keys.findIndex(
        (k) => k.id === keyId && k.userId === userId
      );

      if (keyIndex === -1) {
        return { sukses: false, pesan: "Key tidak ditemukan" };
      }

      // Cancel job lama
      const jobLama = this.jobs.get(keyId);
      if (jobLama) {
        jobLama.cancel();
      }

      // Update hari update
      this.keys[keyIndex].hariUpdate = hariBaru;

      // Hitung tanggal kadaluarsa baru
      const sekarang = new Date();
      const tanggalBaru = new Date(sekarang);
      tanggalBaru.setDate(sekarang.getDate() + hariBaru);

      this.keys[keyIndex].kadaluarsa = tanggalBaru.toISOString();
      this.keys[keyIndex].updateBerikutnya = tanggalBaru.toISOString();

      // Buat job baru
      this.jadwalkanUpdate(keyId, hariBaru);

      await this.saveToFile();

      return {
        sukses: true,
        pesan: `Jadwal update diubah menjadi ${hariBaru} hari`,
        kadaluarsaBerikutnya: tanggalBaru.toISOString(),
      };
    } catch (error) {
      console.error("Gagal ubah jadwal:", error);
      throw error;
    }
  }

  // Verify API key
  async verifikasiKey(apiKey) {
    const dataKey = this.keys.find((k) => k.key === apiKey && k.aktif === true);

    if (dataKey) {
      // Update last used
      dataKey.terakhirDigunakan = new Date().toISOString();
      await this.saveToFile();

      return {
        valid: true,
        userId: dataKey.userId,
        keyId: dataKey.id,
        nama: dataKey.nama,
        kadaluarsa: dataKey.kadaluarsa,
      };
    }

    return { valid: false };
  }

  // Dapatkan semua key user
  getKeyUser(userId) {
    return this.keys
      .filter((k) => k.userId === userId)
      .map((k) => ({
        id: k.id,
        nama: k.nama,
        dibuat: k.dibuat,
        kadaluarsa: k.kadaluarsa,
        hariUpdate: k.hariUpdate,
        aktif: k.aktif,
        updateBerikutnya: k.updateBerikutnya,
        terakhirDigunakan: k.terakhirDigunakan,
        jumlahRiwayat: k.riwayat.length,
      }));
  }

  // Nonaktifkan key
  async nonaktifkanKey(keyId, userId) {
    const keyIndex = this.keys.findIndex(
      (k) => k.id === keyId && k.userId === userId
    );

    if (keyIndex !== -1) {
      // Cancel scheduled job
      const job = this.jobs.get(keyId);
      if (job) {
        job.cancel();
        this.jobs.delete(keyId);
      }

      this.keys[keyIndex].aktif = false;
      await this.saveToFile();

      return { sukses: true, pesan: "Key berhasil dinonaktifkan" };
    }

    return { sukses: false, pesan: "Key tidak ditemukan" };
  }

  // Restore semua scheduled jobs dari data
  restoreScheduledJobs() {
    for (const key of this.keys) {
      if (key.aktif) {
        this.jadwalkanUpdate(key.id, key.hariUpdate);
      }
    }
  }

  // Kirim notifikasi update (template)
  kirimNotifikasiUpdate(userId, keyId, keyBaru) {
    // Implementasi tergantung kebutuhan
    // Bisa email, WhatsApp, atau log saja
    console.log(`Notifikasi: Key ${keyId} telah diupdate`);
    console.log(`User: ${userId}`);
    console.log(`Key baru: ${keyBaru.substring(0, 15)}...`);
  }

  // Simpan ke file JSON
  async saveToFile() {
    try {
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });

      await fs.writeFile(
        this.filePath,
        JSON.stringify(this.keys, null, 2),
        "utf8"
      );
    } catch (error) {
      console.error("Gagal simpan ke file:", error);
      throw error;
    }
  }
}

module.exports = new AutoApiKey();
