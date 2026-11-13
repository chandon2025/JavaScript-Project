export type District = {
  name: string;
  bn: string;
  lat: number;
  lng: number;
  moisture: number; // %
  rainfall: number; // mm / month
  temp: number; // °C
  ndvi: number; // 0-1
  crop: string;
};

export const districts: District[] = [
  { name: "Dhaka", bn: "ঢাকা", lat: 23.81, lng: 90.41, moisture: 42, rainfall: 210, temp: 31, ndvi: 0.38, crop: "Vegetables" },
  { name: "Rajshahi", bn: "রাজশাহী", lat: 24.37, lng: 88.6, moisture: 24, rainfall: 120, temp: 34, ndvi: 0.52, crop: "Mango, Wheat" },
  { name: "Rangpur", bn: "রংপুর", lat: 25.74, lng: 89.25, moisture: 48, rainfall: 260, temp: 29, ndvi: 0.71, crop: "Potato, Maize" },
  { name: "Sylhet", bn: "সিলেট", lat: 24.89, lng: 91.87, moisture: 78, rainfall: 520, temp: 27, ndvi: 0.82, crop: "Tea, Boro Rice" },
  { name: "Khulna", bn: "খুলনা", lat: 22.85, lng: 89.54, moisture: 66, rainfall: 280, temp: 30, ndvi: 0.55, crop: "Shrimp, Rice" },
  { name: "Barishal", bn: "বরিশাল", lat: 22.7, lng: 90.35, moisture: 72, rainfall: 340, temp: 29, ndvi: 0.68, crop: "Aman Rice" },
  { name: "Chattogram", bn: "চট্টগ্রাম", lat: 22.36, lng: 91.78, moisture: 64, rainfall: 410, temp: 28, ndvi: 0.74, crop: "Vegetables, Betel" },
  { name: "Mymensingh", bn: "ময়মনসিংহ", lat: 24.75, lng: 90.41, moisture: 58, rainfall: 300, temp: 30, ndvi: 0.77, crop: "Boro Rice, Jute" },
  { name: "Bogura", bn: "বগুড়া", lat: 24.85, lng: 89.37, moisture: 40, rainfall: 190, temp: 31, ndvi: 0.69, crop: "Potato, Rice" },
  { name: "Dinajpur", bn: "দিনাজপুর", lat: 25.63, lng: 88.64, moisture: 36, rainfall: 170, temp: 30, ndvi: 0.73, crop: "Wheat, Litchi" },
  { name: "Jessore", bn: "যশোর", lat: 23.17, lng: 89.21, moisture: 34, rainfall: 160, temp: 32, ndvi: 0.6, crop: "Vegetables, Flowers" },
  { name: "Cumilla", bn: "কুমিল্লা", lat: 23.46, lng: 91.18, moisture: 60, rainfall: 320, temp: 29, ndvi: 0.66, crop: "Rice, Vegetables" },
];

export const crops = [
  { name: "Boro Rice", season: "Rabi", score: 92, confidence: 88, risk: "Low", water: "High", days: 140, profit: "৳ 48k/acre", emoji: "🌾" },
  { name: "Maize", season: "Rabi", score: 86, confidence: 82, risk: "Low", water: "Medium", days: 110, profit: "৳ 55k/acre", emoji: "🌽" },
  { name: "Potato", season: "Rabi", score: 81, confidence: 79, risk: "Medium", water: "Medium", days: 90, profit: "৳ 62k/acre", emoji: "🥔" },
  { name: "Mustard", season: "Rabi", score: 77, confidence: 84, risk: "Low", water: "Low", days: 85, profit: "৳ 30k/acre", emoji: "🌼" },
  { name: "Jute", season: "Kharif", score: 72, confidence: 75, risk: "Medium", water: "High", days: 120, profit: "৳ 35k/acre", emoji: "🌿" },
  { name: "Lentil", season: "Rabi", score: 69, confidence: 71, risk: "High", water: "Low", days: 100, profit: "৳ 28k/acre", emoji: "🫘" },
];

export const forecast = [
  { day: "Mon", temp: 31, rain: 4, humidity: 72 },
  { day: "Tue", temp: 32, rain: 0, humidity: 68 },
  { day: "Wed", temp: 30, rain: 12, humidity: 80 },
  { day: "Thu", temp: 28, rain: 26, humidity: 88 },
  { day: "Fri", temp: 29, rain: 9, humidity: 82 },
  { day: "Sat", temp: 31, rain: 2, humidity: 70 },
  { day: "Sun", temp: 32, rain: 0, humidity: 66 },
];

export const products = [
  { id: 1, name: "Fresh Aman Rice", cat: "Grains", price: 58, unit: "kg", farmer: "Rahim Uddin", loc: "Barishal", emoji: "🌾" },
  { id: 2, name: "Organic Potatoes", cat: "Vegetables", price: 32, unit: "kg", farmer: "Salma Begum", loc: "Bogura", emoji: "🥔" },
  { id: 3, name: "Himsagar Mango", cat: "Fruits", price: 120, unit: "kg", farmer: "Karim Mia", loc: "Rajshahi", emoji: "🥭" },
  { id: 4, name: "Golden Jute Fibre", cat: "Cash Crops", price: 3200, unit: "maund", farmer: "Abdul Hakim", loc: "Faridpur", emoji: "🌿" },
  { id: 5, name: "Mustard Seeds", cat: "Grains", price: 95, unit: "kg", farmer: "Nasrin Akter", loc: "Sirajganj", emoji: "🌼" },
  { id: 6, name: "Sylhet Tea Leaves", cat: "Cash Crops", price: 450, unit: "kg", farmer: "Joy Barua", loc: "Sylhet", emoji: "🍃" },
  { id: 7, name: "Red Lentils", cat: "Grains", price: 110, unit: "kg", farmer: "Faruk Hossain", loc: "Pabna", emoji: "🫘" },
  { id: 8, name: "Fresh Tomatoes", cat: "Vegetables", price: 45, unit: "kg", farmer: "Rina Das", loc: "Jessore", emoji: "🍅" },
];

export const posts = [
  { id: 1, author: "Rahim Uddin", region: "Barishal", time: "2h ago", text: "Soil moisture dropped to 28% this week. Switched to alternate wetting & drying for Boro — saving almost 20% water already!", likes: 42, comments: 8, tag: "Tip" },
  { id: 2, author: "Salma Begum", region: "Bogura", time: "5h ago", text: "Has anyone tried planting maize after potato in the same season? What spacing worked for you?", likes: 18, comments: 14, tag: "Question" },
  { id: 3, author: "Karim Mia", region: "Rajshahi", time: "1d ago", text: "Heatwave warning for next week. Irrigate mango orchards in the early morning and mulch the base.", likes: 96, comments: 21, tag: "Alert" },
];

export const rotation = [
  { season: "Rabi 2025", crop: "Potato", status: "done" },
  { season: "Kharif-I 2026", crop: "Jute", status: "done" },
  { season: "Kharif-II 2026", crop: "Aman Rice", status: "current" },
  { season: "Rabi 2026", crop: "Mustard", status: "next" },
  { season: "Kharif-I 2027", crop: "Mungbean", status: "next" },
];
