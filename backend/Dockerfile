# Step 1: Menggunakan image Node.js resmi sebagai base image
FROM node:14

# Step 2: Mengatur direktori kerja di dalam container
WORKDIR /usr/src/app

# Step 3: Menyalin file package.json dan package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Menyalin seluruh kode aplikasi ke dalam container
COPY . .

# Step 6: Menyatakan port yang akan digunakan
EXPOSE 5000

# Step 7: Menjalankan aplikasi
CMD ["npm", "start"]
