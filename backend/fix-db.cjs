const fs = require('fs');

let schema = fs.readFileSync('prisma/schema.prisma', 'utf-8');

// Change provider
schema = schema.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');

// Remove @db.Uuid globally
schema = schema.replace(/@db\.Uuid/g, '');

// Convert Json to String
schema = schema.replace(/Json\?/g, 'String?');
schema = schema.replace(/Json/g, 'String');

fs.writeFileSync('prisma/schema.prisma', schema);

console.log('Successfully converted schema to SQLite compatibility.');
