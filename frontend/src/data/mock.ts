export const governorates = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan", 
  "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse", 
  "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid", 
  "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili"
];

export const deliveryAgents = [
  { id: 1, name: "Ahmed Ben Salah", zone: "Grand Tunis", activeOrders: 3, phone: "22 123 456" },
  { id: 2, name: "Mohamed Trabelsi", zone: "Sahel", activeOrders: 5, phone: "55 987 654" },
  { id: 3, name: "Sami Mansour", zone: "Sfax", activeOrders: 2, phone: "98 456 789" },
];

export const orders = [
  { id: "ORD-123456", customer: "Amine Ghozzi", governorate: "Tunis", status: "Pending", total: 156.50 },
  { id: "ORD-123457", customer: "Sonia Mkaouer", governorate: "Sousse", status: "Confirmed", total: 89.00 },
  { id: "ORD-123458", customer: "Yassine Jrad", governorate: "Sfax", status: "Pending", total: 210.00 },
];

export const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 2000 },
  { month: "Apr", sales: 2780 },
  { month: "May", sales: 1890 },
  { month: "Jun", sales: 2390 },
];

export const salesByProduct = [
  { name: "Kaftan Silk", sales: 8500 },
  { name: "Babouche Luxe", sales: 4200 },
  { name: "Poterie Nabeul", sales: 3100 },
  { name: "Tapis Kairouan", sales: 12000 },
];

export const ordersByGovernorate = [
  { name: "Tunis", value: 400 },
  { name: "Sfax", value: 300 },
  { name: "Sousse", value: 300 },
  { name: "Bizerte", value: 200 },
];
