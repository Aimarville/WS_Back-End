# Who Are Ya? – Backend Milestone 0

## 2.1 Proiektuaren Egitura

**Aukera hautatua: C – Egitura hibridoa**

Express Generator erabiltzeak txantioi sendo eta azkar bat eskeintzen du, oso erabilgarria izango zaiguna dena hasieratik ez sortzeko. Hala ere, klasean ikasitako moduan, gabiagoa eta eskalagarriagoa da sub karpetetan crontrolare eta middleware direktorio-ak gehitzen baditugu, beste scriptekin (scrappingekoak adibidez) batera. Hortaz, egitura hibrido bat erabiltzea hautatu dugu.


## 2.2 Zerbitzariaren sarrera-puntua

**Aukera hautatua: B – `server.js`**

Proiektuko `bin/www` egitura sinplifikatu dezakegu `server.js` fitxategian, gure kasuan ez dugulako konfigurazioa eta zerbitzariaren hasieraketa independenteki egingo, eta konfigurazioa inportatzearekin nahiko da eta garbiagoa geratzen da. Gainera, aurreko aukeran (egitura hibridoa, C) hautatukoarekin hobe datorkigu.

## 2.3 Karpeta antolaketa

**Aukera hautatua: C – Antolaketa hibridoa**

Karpeta teknikoak (config, models, middlewares) erabiliko dira baina ibilbideak eta kontrolagailuak argi eta garbi bereizten dituen antolaketa hibridoa erabiliko dugu, kodearen garbitasunaren aldera.

### Hasierako karpeta-zuhaitza

```txt
public/
views/
src/
  config/
  models/
  middlewares/
  routes/
    api/
    admin/
  controllers/
  services/
  scripts/
server.js
```

## 2.4 Konfigurazioaren kudeaketa

**Aukera hautatua: B – `server.js`**

`src/config/index.js` fitxategiak aldagai guztiak `.env`-etik kargatzen ditu, baliozkotzen ditu eta lehenetsitako balioak eskaintzen ditu falta badira. Horrela, aplikazioak modu zentralizatuan kudeatzen ditu kode errepikakorra sahieztuz. Horregatik, konfigurazio zentralizatua hautatu dugu.

### Beharrezko aldagaiak:

```txt
PORT=3000
MONGO_URI=mongodb://localhost:27017/whoareya
SESSION_SECRET=sesio_sekretua_adibidez
```

## 2.5 Ibilbideak

**Mota / Metodoa / Endpoint / Deskribapena / Baimena / Non Eskatua Dokumentuan**

---

### EJSrako (interfazea)

| Mota  | Metodoa | Endpoint | Deskribapena | Baimena | Eskatua |
|------|--------|---------|--------------|---------|---------|
| Jokoa | GET | `/` | Hasierako interfazea | Edonork | 6.5 |
| Jokoa | GET | `/players` | Jokalari guztiak lortu (auto-osaketa) | Edonork | 6.5 |
| Jokoa | GET | `/solution/:gameNumber` | Eguneko soluzio-jokalaria lortu | Edonork | 6.5 |
| Jokoa | GET | `/players/:id` | Jokalari zehatz baten datuak lortu (konparatzeko) | Edonork | 6.5 |

---

### JSONak lortzeko (API REST)

#### Autentifikazioa

| Mota | Metodoa | Endpoint | Deskribapena | Baimena | Eskatua |
|-----|--------|---------|--------------|---------|---------|
| API | POST | `/api/auth/register` | Erabiltzaile bat erregistratu | Edonork | 3 |
| API | POST | `/api/auth/login` | Erabiltzailea logeatu | Edonork | 3 |
| API | POST | `/api/auth/logout` | Saioa itxi | Logeatua | 3 |

#### Jokalariak

| Mota | Metodoa | Endpoint | Deskribapena | Baimena | Eskatua |
|-----|--------|---------|--------------|---------|---------|
| API | GET | `/api/players` | Jokalariak eskuratu | Edonork | 6.1 |
| API | GET | `/api/players/:id` | Jokalari zehatza lortu | Edonork | 6.1 |
| API | POST | `/api/players` | Jokalari bat sortu | Admin | 6.1 |
| API | PUT | `/api/players/:id` | Jokalari bat eguneratu | Admin | 6.1 |
| API | DELETE | `/api/players/:id` | Jokalari bat ezabatu | Admin | 6.1 |

#### Beste baliabideak

| Mota | Metodoa | Endpoint | Deskribapena | Baimena | Eskatua |
|-----|--------|---------|--------------|---------|---------|
| API | GET | `/api/teams` | Ekipoak eskuratu | Edonork | 6.2 |
| API | GET | `/api/leagues` | Ligak eskuratu | Edonork | 6.2 |

---

### Administrazioa (Admin panela)

| Mota | Metodoa | Endpoint | Deskribapena | Baimena | Eskatua |
|-----|--------|---------|--------------|---------|---------|
| ADMIN | GET | `/admin` | Jokalari zerrenda | Admin | 7.2 |
| ADMIN | GET | `/admin/players/new` | Jokalariak sortzeko formularioa | Admin | 7.2 |
| ADMIN | POST | `/admin/players/new` | Jokalaria sortu | Admin | 7.2.1 |
| ADMIN | GET | `/admin/players/edit/:id` | Jokalaria eguneratzeko formularioa | Admin | 7.2.1 |
| ADMIN | PUT | `/admin/players/edit/:id` | Jokalaria eguneratu | Admin | 7.2.1 |
| ADMIN | DELETE | `/admin/players/delete/:id` | Jokalaria ezabatu | Admin | 7.2 |
