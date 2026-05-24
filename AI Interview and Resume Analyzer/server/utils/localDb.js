const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/local_db.json');

// Ensure database directory and file exist
function initDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], resumes: [], interviews: [] }, null, 2));
  }
}

function readDb() {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading local JSON database, resetting...', error);
    const emptyDb = { users: [], resumes: [], interviews: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(emptyDb, null, 2));
    return emptyDb;
  }
}

function writeDb(data) {
  initDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const localDb = {
  users: {
    find: () => {
      const db = readDb();
      return db.users;
    },
    findOne: (query) => {
      const db = readDb();
      return db.users.find(u => {
        return Object.keys(query).every(key => u[key] === query[key]);
      });
    },
    findById: (id) => {
      const db = readDb();
      return db.users.find(u => u.id === id || u._id === id);
    },
    create: (userData) => {
      const db = readDb();
      const newUser = {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...userData
      };
      db.users.push(newUser);
      writeDb(db);
      return newUser;
    },
    findByIdAndUpdate: (id, updateData) => {
      const db = readDb();
      const index = db.users.findIndex(u => u.id === id || u._id === id);
      if (index !== -1) {
        db.users[index] = { ...db.users[index], ...updateData };
        writeDb(db);
        return db.users[index];
      }
      return null;
    }
  },
  resumes: {
    find: (query = {}) => {
      const db = readDb();
      return db.resumes.filter(r => {
        return Object.keys(query).every(key => r[key] === query[key]);
      });
    },
    findById: (id) => {
      const db = readDb();
      return db.resumes.find(r => r.id === id || r._id === id);
    },
    create: (resumeData) => {
      const db = readDb();
      const newResume = {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...resumeData
      };
      db.resumes.push(newResume);
      writeDb(db);
      return newResume;
    },
    findByIdAndDelete: (id) => {
      const db = readDb();
      const index = db.resumes.findIndex(r => r.id === id || r._id === id);
      if (index !== -1) {
        const deleted = db.resumes.splice(index, 1)[0];
        writeDb(db);
        return deleted;
      }
      return null;
    }
  },
  interviews: {
    find: (query = {}) => {
      const db = readDb();
      return db.interviews.filter(i => {
        return Object.keys(query).every(key => i[key] === query[key]);
      });
    },
    findById: (id) => {
      const db = readDb();
      return db.interviews.find(i => i.id === id || i._id === id);
    },
    create: (interviewData) => {
      const db = readDb();
      const newInterview = {
        _id: Date.now().toString(),
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...interviewData
      };
      db.interviews.push(newInterview);
      writeDb(db);
      return newInterview;
    }
  }
};

module.exports = localDb;
