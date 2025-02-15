import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { supabase } from '@/utils/supabase';

const data = [
  { "price": 116000,
    "id": 60,
    "title": "KG CREAM CRACKERS 120GX20",
    "image": "/images/khong_guan_khong_guan_cream_crackers_120_gram_full01_hn0ww3pv.webp",
    "category": "khong-guan"
  },
  { "price": 128000,
    "id": 61,
    "title": "KG CREAM CRACKERS 200GX16 PAK",
    "image": "/images/cc200.jpg",
    "category": "khong-guan"
  },
  { "price": 336000,
    "id": 62,
    "title": "KG CREAM CRACKERS 350GX24 PAK",
    "image": "/images/cc350.jpg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 63,
    "title": "KG GABIN COKELAT 16GX12PX10RCG",
    "image": "/images/sg-11134201-22110-mvmbaylahfjv3d.jpeg",
    "category": "khong-guan"
  },
  { "price": 130000,
    "id": 64,
    "title": "KG KRAKERS SAYUR 135GX20 PAK",
    "image": "/images/csayur.png",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 65,
    "title": "KG LA COCO CHOCOLATE 24GX12PX10RCG",
    "image": "/images/lacoco.jpg",
    "category": "khong-guan"
  },
  { "price": 235000,
    "id": 66,
    "title": "KG LEMON PUFF CREAM 6KGX1TIN",
    "image": "/images/lemonpuff.jpg",
    "category": "khong-guan"
  },
  { "price": 68000,
    "id": 67,
    "title": "KG MALKIST ABON SAPI 21GX8PX10RCG",
    "image": "/images/abonrcg.webp",
    "category": "khong-guan"
  },
  { "price": 125000,
    "id": 68,
    "title": "KG MALKIST ABON SAPI 135GX20 PAK",
    "image": "/images/44281989_8e4d66be-c070-45f5-839d-2df2f1eaeedc_800_800.jpeg",
    "category": "khong-guan"
  },
  { "price": 372000,
    "id": 69,
    "title": "KG MALKIST ABON SAPI 800GX6TIN",
    "image": "/images/abontin.jpeg",
    "category": "khong-guan"
  },
  { "price": 120000,
    "id": 70,
    "title": "KG MALKIST CRACKERS 200GX16PAK",
    "image": "/images/id-11134207-7rask-m15sgj7da1oi76.jpeg",
    "category": "khong-guan"
  },
  { "price": 125000,
    "id": 71,
    "title": "KG MALKIST CRACKERS 135GX20",
    "image": "/images/12fced34-378a-4721-8d24-4614eaf12010.jpg",
    "category": "khong-guan"
  },
  { "price": 68000,
    "id": 72,
    "title": "KG MALKIST CRACKERS 21GX8PX10RCG",
    "image": "/images/38c2256d-0032-40a9-851f-f6a435a156fb.jpeg",
    "category": "khong-guan"
  },
  { "price": 68000,
    "id": 73,
    "title": "KG MALKIST KELAPA 21GX8PX10RCG",
    "image": "/images/khong_guan_khongguan_malkist_kelapa_27_gram_-10_pcs-_full02_kwosnuda.webp",
    "category": "khong-guan"
  },
  { "price": 126000,
    "id": 74,
    "title": "KG MALKIST SALUT COKLAT 100GX20PAK",
    "image": "/images/id-11134207-7rask-m2aoewx90zy132.jpeg",
    "category": "khong-guan"
  },
  { "price": 130000,
    "id": 75,
    "title": "KG MALKIST SEAWEED 135GX20 PAK",
    "image": "/images/71160237_d3a21b88-2f4a-4faa-92ea-e9203daa7ba0_800_800.jpeg",
    "category": "khong-guan"
  },
  { "price": 312000,
    "id": 76,
    "title": "KG MARIE SPECIAL 225GX24 PAK",
    "image": "/images/ProductMariebiscuit_khongguan_225gr.png",
    "category": "khong-guan"
  },
  { "price": 178000,
    "id": 77,
    "title": "KG MARIE SUSU 160GX20 PAK",
    "image": "/images/2d519d1c4158ba8743105cc693a91bde.jpeg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 78,
    "title": "KG SALTCHEESE COMBERRY 17GX12PX10RCG",
    "image": "/images/cb.jpg",
    "category": "khong-guan"
  },
  { "price": 196000,
    "id": 79,
    "title": "KG SALTCHEESE COMBO 175GX20 PAK",
    "image": "/images/scb.jpg",
    "category": "khong-guan"
  },
  { "price": 126000,
    "id": 80,
    "title": "KG SALTCHEESE COMBO 17GX12BAGX10RCG",
    "image": "/images/9fa3dcab26f1312ce09e95cb42334ec3.jpeg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 81,
    "title": "KG SALTCHEESE COMBO 17GX12PX10RCG",
    "image": "/images/comborcg1.jpg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 82,
    "title": "KG SALTCHEESE COMBO 34GRX6PAKX10RTG",
    "image": "/images/id-11134207-7r98y-llkcrt4uxqocea.jpeg",
    "category": "khong-guan"
  },
  { "price": 196000,
    "id": 83,
    "title": "KG SALTCHEESE COMBOCIZ 175GX20 PAK",
    "image": "/images/72dc7c94-5bfa-46e4-8c36-8fca8c64c5b2.jpg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 84,
    "title": "KG SALTCHEESE COMBOCIZ 17GX12PX10RCG",
    "image": "/images/cbciz.jpg",
    "category": "khong-guan"
  },
  { "price": 264000,
    "id": 85,
    "title": "KG SALTCHEESE CRACKERS 200GX30",
    "image": "/images/b22536504c24d29ed0ee97768eb25502.jpeg",
    "category": "khong-guan"
  },
  { "price": 228000,
    "id": 87,
    "title": "KG SALTCHEESE CRACKERS 336G X 6 TIN",
    "image": "/images/4f39f9db0c6845f25b320e488201addd.jpeg",
    "category": "khong-guan"
  },
  { "price": 264000,
    "id": 88,
    "title": "KG SALTCHEESE CRACKERS BARBEQUE 200GX30",
    "image": "/images/76cee77302d7520c897c200fe3984f89.jpeg",
    "category": "khong-guan"
  },
  { "price": 204000,
    "id": 89,
    "title": "KG SALTCHEESE CRACKERS GT 200GX24PAK",
    "image": "/images/b22536504c24d29ed0ee97768eb25502.jpeg",
    "category": "khong-guan"
  },
  { "price": 184000,
    "id": 90,
    "title": "KG SALTCHEESE CRACKERS POCKET 100GX40",
    "image": "/images/6540910_2f8354da-3396-46e1-9172-308ab18aad47_672_672.jpeg",
    "category": "khong-guan"
  },
  { "price": 204000,
    "id": 91,
    "title": "KG SUPERCO 138GX30 PAK",
    "image": "/images/ca506d6709893db4c1345b8b1800b807.jpeg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 92,
    "title": "KG SUPERCO 22GX12PX10RCG",
    "image": "/images/superco.png",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 93,
    "title": "KG SUPERCO 33GX6PX10RCG",
    "image": "/images/sg-11134201-7rbkt-lplscopgwwep41.jpeg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 94,
    "title": "KG SUPERCO LEMON 22GX12PX10RCG",
    "image": "/images/id-11134207-7r98q-lwmsq0w6fshp57.jpeg",
    "category": "khong-guan"
  },
  { "price": 606000,
    "id": 95,
    "title": "KG WAFER CHOCOLATE 1300GX6TIN",
    "image": "/images/khong_guan_khong_guan_wafers_wafer_chocolate_1300g_1300_gram_full01_flj9p04c.jpg",
    "category": "khong-guan"
  },
  { "price": 324000,
    "id": 96,
    "title": "KG WAFER CHOCOLATE 600GX6 TIN",
    "image": "/images/53209521-d7be-4819-9f02-20ad43bdff7c.jpg",
    "category": "khong-guan"
  },
  { "price": 234000,
    "id": 97,
    "title": "KG WAFER CLASSIC CHOCOLATE MINI 310GX6TIN",
    "image": "/images/classicmini.jpg",
    "category": "khong-guan"
  },
  { "price": 234000,
    "id": 98,
    "title": "KG WAFER CLASSIC COKLAT 350X12 PAK",
    "image": "/images/khong_guan_khong_guan_-_classic_chocolate_wafer_-_350_gr_full01_ebr8sen.webp",
    "category": "khong-guan"
  },
  { "price": 170000,
    "id": 99,
    "title": "KG WAFER GRAND CLASSIC CHOCOLATE 18GX10PX20RCG",
    "image": "/images/sg-11134201-22120-zfmc7ldqq4kvd5.jpeg",
    "category": "khong-guan"
  },
  { "price": 141000,
    "id": 100,
    "title": "KG WAFER GRAND CLASSIC CHOCOLATE 72GX30 PAK",
    "image": "/images/3a75e020414bf0c1cb8f59e8853fa8cc.jpg",
    "category": "khong-guan"
  },
  { "price": 198000,
    "id": 101,
    "title": "KG WAFER STICK CHOCOLATE 500GX6 TPL",
    "image": "/images/9215df25-5b51-4507-b3a3-ee4cc58eab17.jpg",
    "category": "khong-guan"
  },
  { "price": 80000,
    "id": 102,
    "title": "KITARO SNACK MI AYAM 5*20*18 GR",
    "image": "/images/GfU6idLFJe12Tcb2rQljSPfJGdS9eFMKizGWcJXK.jpg",
    "category": "yafindo"
  },
  { "price": 80000,
    "id": 103,
    "title": "KITARO SNACK MI ORI 5*20*18 GR",
    "image": "/images/UDhAEGpuXMPs4sTrpnZzl4rXid8a4QoEapyEh0ep.jpg",
    "category": "yafindo"
  },
  { "price": 102000,
    "id": 104,
    "title": "LEMONIA CHOCOLATE 18GRX12PAKX10SCT",
    "image": "/images/9e85a2a8d1083fd36796008d2b3f2ba2.jpeg",
    "category": "khong-guan"
  },
  { "price": 252000,
    "id": 105,
    "title": "LEMONIA CHOCOLATE COOKIES 130GX36",
    "image": "/images/2d519d1c4158ba8743105cc693a91bde.jpg",
    "category": "khong-guan"
  },
  { "price": 156000,
    "id": 106,
    "title": "LEMONIA CHOCOLATE COOKIES GT 130GX24PAK",
    "image": "/images/2d519d1c4158ba8743105cc693a91bde.jpg",
    "category": "khong-guan"
  },
  { "price": 252000,
    "id": 107,
    "title": "LEMONIA COOKIES 130GX36",
    "image": "/images/nissin_nissin_lemonia_130_gr_full01_cgeejw6x.webp",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 108,
    "title": "LEMONIA COOKIES 20GX12X10",
    "image": "/images/nissin_nissin_lemonia_cookies_original_20_gr_full01_ndgc3l98.webp",
    "category": "khong-guan"
  },
  { "price": 300000,
    "id": 109,
    "title": "LEMONIA COOKIES 650GX6 TIN",
    "image": "/images/lm.jpg",
    "category": "khong-guan"
  },
  { "price": 156000,
    "id": 110,
    "title": "LEMONIA COOKIES GT 130GX24PAK",
    "image": "/images/nissin_nissin_lemonia_130_gr_full01_cgeejw6x.webp",
    "category": "khong-guan"
  },
  { "price": 318000,
    "id": 111,
    "title": "LEMONIA TWIST 360GX6 TIN",
    "image": "/images/twitst.webp",
    "category": "khong-guan"
  },
  { "price": 250000,
    "id": 112,
    "title": "MARGARIN FORVITA 500 GR X24",
    "image": "/images/id-11134207-7r992-lswtiljxk1ev34.jpeg",
    "category": "bkp"
  },
  { "price": 342000,
    "id": 113,
    "title": "MARGARIN FORVITA 60X200G",
    "image": "/images/b8e923d3366aff0dacaa3ebd926750d4.png_720x720q80.png",
    "category": "bkp"
  },
  { "price": 32400,
    "id": 114,
    "title": "MARICO CUP JUMBO DEGAN",
    "image": "/images/Frame-140-1024x1024.png",
    "category": "yafindo"
  },
  { "price": 32400,
    "id": 115,
    "title": "MARICO CUP JUMBO KELAPA JERUK",
    "image": "/images/kelapaj.png",
    "category": "yafindo"
  },
  { "price": 32400,
    "id": 116,
    "title": "MARICO CUP JUMBO LECI",
    "image": "/images/Frame-139-1024x1024.png",
    "category": "yafindo"
  },
  { "price": 32400,
    "id": 117,
    "title": "MARICO CUP JUMBO MANGGA MADU",
    "image": "/images/manggamadu.png",
    "category": "yafindo"
  },
  { "price": 32400,
    "id": 118,
    "title": "MARICO CUP JUMBO MELON",
    "image": "/images/Frame-138-1024x1024.png",
    "category": "yafindo"
  },
  { "price": 79380,
    "id": 119,
    "title": "MARICO JELLY GUM ANGGUR",
    "image": "/images/a08f54cb566aa1d55c5b4f4a41cf35cc.jpeg",
    "category": "yafindo"
  },
  { "price": 79380,
    "id": 120,
    "title": "MARICO JELLY GUM LECI",
    "image": "/images/21607edfd37a0a7432a1d66f25f8d2c7.jpeg",
    "category": "yafindo"
  },
  { "price": 79380,
    "id": 121,
    "title": "MARICO JELLY GUM MANGGA",
    "image": "/images/213f5151246e07b637666a8489340546.jpeg",
    "category": "yafindo"
  },
  { "price": 79380,
    "id": 122,
    "title": "MARICO JELLY GUM STRAWBERY",
    "image": "/images/sg-11134201-7rbl6-lmugpkpdlis9f9.jpeg",
    "category": "yafindo"
  },
  { "price": 378000,
    "id": 123,
    "title": "MD BOURBON 6X800G",
    "image": "/images/b02602c1-4ee7-42ee-b573-4763fd19063b.jpg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 124,
    "title": "MD BOURBON CHOCOLATE 12X10X24G",
    "image": "/images/monde_monde_bourbon_coklat_mini_biscuit_24gr_-10_sachet-renceng-_full01_oo4tp2s0.jpg",
    "category": "khong-guan"
  },
  { "price": 816000,
    "id": 125,
    "title": "MD D'ASSE CHOCOLATE 12X225G",
    "image": "/images/79609d09-f54f-4e05-ab38-a41e105945b7.jpeg",
    "category": "khong-guan"
  },
  { "price": 290000,
    "id": 126,
    "title": "MD GENJI LEMON PIE 20X95G",
    "image": "/images/03c94915-fe04-4a80-a7c1-e0e140e8c93b.jpeg",
    "category": "khong-guan"
  },
  { "price": 216000,
    "id": 127,
    "title": "MD GENJI LEMON PIE 24X85G",
    "image": "/images/monde_monde-genji-pie-lemon-85-gr_full01.webp",
    "category": "khong-guan"
  },
  { "price": 168000,
    "id": 128,
    "title": "MD GENJI MINI ORIGINAL PIE 24X50G",
    "image": "/images/monde_monde-genji-mini-pie-original-50-gr_full01.webp",
    "category": "khong-guan"
  },
  { "price": 290000,
    "id": 129,
    "title": "MD GENJI ORIGINAL PIE 20X85G",
    "image": "/images/monde_monde_genji_pie_85_gr_full01_trs0onwt.webp",
    "category": "khong-guan"
  },
  { "price": 216000,
    "id": 130,
    "title": "MD GENJI ORIGINAL PIE 24X70G",
    "image": "/images/id-11134207-7r98p-lzogsvbkbv1ae3.jpeg",
    "category": "khong-guan"
  },
  { "price": 290000,
    "id": 131,
    "title": "MD GENJI RAISIN PIE 20X95G",
    "image": "/images/1fc4163a41b38728dc8602ca249a0275.jpeg",
    "category": "khong-guan"
  },
  { "price": 216000,
    "id": 132,
    "title": "MD GENJI RAISIN PIE 24X85G",
    "image": "/images/monde_monde-genji-raisin-pie--85-g-_full03.webp",
    "category": "khong-guan"
  },
  { "price": 216000,
    "id": 133,
    "title": "MD GENJI SOFT PIE COKLAT 24X85G",
    "image": "/images/monde_genji_soft_pie_chocolate_85_gr_full03_os7jhcjt.webp",
    "category": "khong-guan"
  },
  { "price": 216000,
    "id": 134,
    "title": "MD GENJI SOFT PIE STRAWBERRY 24X85G",
    "image": "/images/00085920107a.jpg",
    "category": "khong-guan"
  },
  { "price": 290000,
    "id": 135,
    "title": "MD GENJI STRAWBERRY PIE 20X95G",
    "image": "/images/monde_genji_strawberry_pie_95_gr_full03_m1g356lx.webp",
    "category": "khong-guan"
  },
  { "price": 216000,
    "id": 136,
    "title": "MD GENJI STRAWBERRY PIE 24X85G",
    "image": "/images/71160237_a104ca90-5c70-400c-ad25-2348756a0cc5_900_900.jpeg",
    "category": "khong-guan"
  },
  { "price": 192000,
    "id": 137,
    "title": "MD piebis 24x190g",
    "image": "/images/mdpiebis.jpg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 138,
    "title": "MD PIEBIS 6X10X40G",
    "image": "/images/id-11134207-7qul1-lkdn8qh24jp2ed.jpeg",
    "category": "khong-guan"
  },
  { "price": 276000,
    "id": 139,
    "title": "MD TOP SELECTED BULAT 6X450G",
    "image": "/images/no-brand_monde-asst-top-selected-mini-450gr_full01-9c4742b5.webp",
    "category": "khong-guan"
  },
  { "price": 516000,
    "id": 140,
    "title": "MD-TOP SELECTED PERSEGI 6X1050G",
    "image": "/images/ba907f33-4d23-4d92-a4dc-ca11322bbf47.jpg",
    "category": "khong-guan"
  },
  { "price": 552000,
    "id": 141,
    "title": "MD-FAVOURITE BISCUIT 6X575 G",
    "image": "/images/14ebf799-7418-49fd-85ba-c801dcfe9224.jpg",
    "category": "khong-guan"
  },
  { "price": 660000,
    "id": 142,
    "title": "MD-HARMONY ASSORTMENT 6X850 G",
    "image": "/images/harmony.jpg",
    "category": "khong-guan"
  },
  { "price": 672000,
    "id": 143,
    "title": "MD-PIE SELECTION 6X800 G",
    "image": "/images/selection.jpg",
    "category": "khong-guan"
  },
  { "price": 360000,
    "id": 144,
    "title": "MD-PIE SELECTION GOLD 6X800G",
    "image": "/images/gold.jpg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 145,
    "title": "MINYAK FITRI 400ML",
    "image": "/images/id-11134207-7r98t-lrs21pledykma2.jpeg",
    "category": "bkp"
  },
  { "price": 105000,
    "id": 245,
    "title": "MINYAK FITRI 200ML",
    "image": "/images/fitri200.jpg",
    "category": "bkp"
  },
  { "price": 232000,
    "id": 146,
    "title": "MINYAK HEMART 1LT",
    "image": "/images/c2338eec-1b25-4826-ab31-32263bc7e84a.jpg",
    "category": "bkp"
  },
  { "price": 122000,
    "id": 147,
    "title": "MINYAK HEMART 500ML",
    "image": "/images/id-11134207-7r990-lt8zb329o22l68.jpeg",
    "category": "bkp"
  },
  { "price": 188000,
    "id": 148,
    "title": "MINYAK RIZKY 800ML",
    "image": "/images/8124a217403dc9e096470a92d5e0a149.png_720x720q80.png",
    "category": "bkp"
  },
  { "price": 195000,
    "id": 149,
    "title": "MINYAK RIZKY 850 ML",
    "image": "/images/id-11134207-7r98q-lx6jsde5l6pa70.jpeg",
    "category": "bkp"
  },
  { "price": 94080,
    "id": 150,
    "title": "MY NORY AYAM",
    "image": "/images/SekKm5XKhzZrvxvNJ3zbxZBVSg4dH6E0hfc3M5gz.jpg",
    "category": "yafindo"
  },
  { "price": 94080,
    "id": 151,
    "title": "MY NORY BALADO",
    "image": "/images/T8WuDsmTd2A7Z3cSxFzQA9kcpArLJz8NAUAZPRkE.jpg",
    "category": "yafindo"
  },
  { "price": 94080,
    "id": 152,
    "title": "MY NORY MIE GORENG",
    "image": "/images/id-11134207-7ras8-m20v86wrqwls9b.jpeg",
    "category": "yafindo"
  },
  { "price": 94080,
    "id": 153,
    "title": "MY NORY ORI",
    "image": "/images/yMVIUStEeRrseGxqTI896YXWcKXLXNdi6WyS0qQb.jpg",
    "category": "yafindo"
  },
  { "price": 94080,
    "id": 154,
    "title": "MY NORY SAPI",
    "image": "/images/SekKm5XKhzZrvxvNJ3zbxZBVSg4dH6E0hfc3M5gz (1).jpg",
    "category": "yafindo"
  },
  { "price": 112160,
    "id": 155,
    "title": "NORI ONE ROLL BBQ",
    "image": "/images/bbq.png",
    "category": "nori-one"
  },
  { "price": 112160,
    "id": 156,
    "title": "NORI ONE ROLL MIE GORENG",
    "image": "/images/no-img.svg",
    "category": "nori-one"
  },
  { "price": 112160,
    "id": 157,
    "title": "NORI ONE ROLL ORIGINAL",
    "image": "/images/no-img.svg",
    "category": "nori-one"
  },
  { "price": 112160,
    "id": 158,
    "title": "NORI ONE ROLL SAMBAL MATAH",
    "image": "/images/sambal.jpg",
    "category": "nori-one"
  },
  { "price": 43500,
    "id": 159,
    "title": "NPL 1500 ML X 12",
    "image": "/images/nplbesar.jpg",
    "category": "nestle"
  },
  { "price": 33700,
    "id": 160,
    "title": "NPL 330 ML X 24",
    "image": "/images/mini.jpg",
    "category": "nestle"
  },
  { "price": 41500,
    "id": 161,
    "title": "NPL 600 ML X 24",
    "image": "/images/tanggung.jpg",
    "category": "nestle"
  },
  { "price": 324000,
    "id": 162,
    "title": "NS ASSORTED BISCUITS YELLOW BULAT 650GX6 TIN",
    "image": "/images/nissin_nissin_assorted_yellow_bulat_650_gr_full01_fuka1xj6.webp",
    "category": "khong-guan"
  },
  { "price": 492000,
    "id": 163,
    "title": "NS ASSORTED BISCUITS YELLOW SEGI 1100GX6TIN",
    "image": "/images/d76de6886a336f2320b90b7e33d7b4fc.jpeg",
    "category": "khong-guan"
  },
  { "price": 216000,
    "id": 164,
    "title": "NS BUTTER COCONUT BISCUIT 345GX6 TIN",
    "image": "/images/45d2cc42-a376-489b-9020-135c30197824.jpg",
    "category": "khong-guan"
  },
  { "price": 300000,
    "id": 165,
    "title": "NS BUTTER COCONUT BISCUIT 650GX6 tin",
    "image": "/images/3009f302-4080-4b0a-a30e-168855f795de.jpg",
    "category": "khong-guan"
  },
  { "price": 204000,
    "id": 166,
    "title": "NS BUTTER COCONUT BISKUIT 200GX24",
    "image": "/images/f58b47d0-8421-4894-8e73-9d8dd7011b08.jpg",
    "category": "khong-guan"
  },
  { "price": 318000,
    "id": 167,
    "title": "NS BUTTER COCONUT DUO 345X6",
    "image": "/images/0f9fa0d3a6e68d9867bb697d17d143fa.jpeg",
    "category": "khong-guan"
  },
  { "price": 182000,
    "id": 168,
    "title": "NS-FRYCHIP 20X300 G",
    "image": "/images/Biscuit-Exporter-Export-Cookies-Pie-Crackers-Sandwich-Wafers-Snacks-Assorted-Khong-Guan-Monde-Nissin-Indonesia-JCB-Food-pdk-bru-5.jpg",
    "category": "khong-guan"
  },
  { "price": 144000,
    "id": 169,
    "title": "NS-HEXA CRACKERS 18X225 G",
    "image": "/images/nissin_nissin-hexa-crackers-225-gram_full01.webp",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 170,
    "title": "NS-RINDLE COCONUT 12X300 G",
    "image": "/images/1fe7440ed5abb80f90e5001c24c262d9.jpeg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 171,
    "title": "NS-RINDLE kopi 12X300 G",
    "image": "/images/id-11134207-7r98u-llbhlawfv6ltee.jpeg",
    "category": "khong-guan"
  },
  { "price": 182000,
    "id": 172,
    "title": "NS-STICK DURIAN 20X300 G",
    "image": "/images/stik-durian.jpg",
    "category": "khong-guan"
  },
  { "price": 594000,
    "id": 173,
    "title": "NS-TRENDY ASSORTMENT 6X850 G",
    "image": "/images/nissin_nissin_trendy_assorment_cookies_850_gr_full01_jz9wn4cz.webp",
    "category": "khong-guan"
  },
  { "price": 62720,
    "id": 174,
    "title": "POPUKON KRMLLW COKLAT 4*10*20G***",
    "image": "/images/id-11134207-7r98t-lvx46vkh9x8td8.jpeg",
    "category": "yafindo"
  },
  { "price": 62720,
    "id": 175,
    "title": "POPUKON KRMLLW KARAMEL 4*10*20G***",
    "image": "/images/no-img.svg",
    "category": "yafindo"
  },
  { "price": 62720,
    "id": 176,
    "title": "POPUKON KRMLLW STROBERI 4*10*20G***",
    "image": "/images/id-11134207-7r98t-lvx46vkh9x8td8.jpeg",
    "category": "yafindo"
  },
  { "price": 49000,
    "id": 177,
    "title": "SOES POUCH ARJUNA KEJU 30 PCS",
    "image": "/images/1826100189096476672.jpg",
    "category": "arjuna"
  },
  { "price": 49000,
    "id": 178,
    "title": "SOES POUCH ARJUNA STRAWBERRY 30 PCS",
    "image": "/images/1826102443596668928.jpg",
    "category": "arjuna"
  },
  { "price": 49000,
    "id": 179,
    "title": "SOES POUCH ARJUNA VANILLA 30 PCS",
    "image": "/images/1826102736897081344.jpg",
    "category": "arjuna"
  },
  { "price": 49000,
    "id": 180,
    "title": "SOES POUCH ARJUNA COKELAT 30 PCS",
    "image": "/images/POUCH-SOES-ARJUNA-COKELAT-BACKGROUND.jpg",
    "category": "arjuna"
  },
  { "price": 216000,
    "id": 181,
    "title": "SR ASSORTED BISCUITS LEGEND MINI 287GX6 TIN",
    "image": "/images/serena_serena_ass_bisc_legend_bulat_287_gr_full01_knpurux7.webp",
    "category": "khong-guan"
  },
  { "price": 384000,
    "id": 182,
    "title": "SR ASSORTED BISCUITS LEGEND SEGI 580GX6TIN",
    "image": "/images/27c4c3ca26dda2700170c515411d4fbb.jpeg",
    "category": "khong-guan"
  },
  { "price": 780000,
    "id": 183,
    "title": "SR CHEESE COOKIES 454GX12 TIN",
    "image": "/images/20076737_1.jpg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 184,
    "title": "SR CHOCOLATE SHORTCAKE SIIP 42GX6PX10",
    "image": "/images/id-11134207-7r98q-lrfdaez3tydifd.jpeg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 185,
    "title": "SR KLIK CRACKERS 24GX12X10",
    "image": "/images/316698446_1815859535437422_1472623727682383011_n.jpg",
    "category": "khong-guan"
  },
  { "price": 294000,
    "id": 186,
    "title": "SR SHORTCAKE BANANA CREAM 225 G X 30 PAK",
    "image": "/images/464669168_18443122285066806_6183329551910662005_n.jpg",
    "category": "khong-guan"
  },
  { "price": 294000,
    "id": 187,
    "title": "SR SHORTCAKE COKLAT CREAM 225 G X 30 P",
    "image": "/images/399651208_18380286091066806_8473065539036180158_n.jpg",
    "category": "khong-guan"
  },
  { "price": 294000,
    "id": 188,
    "title": "SR SHORTCAKE MILK CREAM 225X30P",
    "image": "/images/56563b4c115399821618c1b83f3672c5.jpeg",
    "category": "khong-guan"
  },
  { "price": 294000,
    "id": 189,
    "title": "SR SHORTCAKE STRAWBERRY CREAM 225 G X 30 PAK",
    "image": "/images/ProductSerenastrawshortcake225gr.jpg",
    "category": "khong-guan"
  },
  { "price": 294000,
    "id": 190,
    "title": "SR SHORTCAKE TIRAMISU CREAM 225 G X 30 PAK",
    "image": "/images/id-11134207-7ras8-m1s2fi7x2nqp7a.jpeg",
    "category": "khong-guan"
  },
  { "price": 384000,
    "id": 191,
    "title": "SR TOGO ASSORTED 220GX12 TIN",
    "image": "/images/0737277400cb1379d81bb7a269b31188.jpg",
    "category": "khong-guan"
  },
  { "price": 180000,
    "id": 192,
    "title": "SR TOGO LONG CREAM COKLAT 128GTX30PACK",
    "image": "/images/8fdbcc8d-c17f-4502-ab64-1b311818a538.jpg",
    "category": "khong-guan"
  },
  { "price": 180000,
    "id": 193,
    "title": "SR TOGO LONG CREAM PEANUT 128GX30P",
    "image": "/images/5f876ce2e2d9026417758eeafb128865.jpeg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 194,
    "title": "SR TOGO SIIP BLACK CREAM VANILA 22GGX12X10",
    "image": "/images/ef058aaf2004825061d4f590e5e0893f.jpeg",
    "category": "khong-guan"
  },
  { "price": 102000,
    "id": 195,
    "title": "SR TOGO SIIP CHOCOLATE 22GG12PX10",
    "image": "/images/fd10215dd9d9b44bfd6aa026d71185ae.jpeg",
    "category": "khong-guan"
  },
  { "price": 96000,
    "id": 196,
    "title": "TAMADA GEMSTAR 30 GRAM 6 PAK X 10",
    "image": "/images/f4xw2ylomftwk4ronfsgqltjmqxxk4dmn5qwi4zpmruxg5dsnfrhk5dpoixtcnjwge2tmmjygqxxa4tpmr2wg5bpguydqmbvgiytgmzpizfwy52vheydeodygnbeu6tknyxgu4dhh53t2nrqgatgqpjwgaya-.jpg",
    "category": "yafindo"
  },
  { "price": 88200,
    "id": 197,
    "title": "TAMADA MARSMELLOW CONE COKLAT 6X12X17G",
    "image": "/images/0pOCcxRTHTH47QZmN7tqrov0Lfx9TNOytRC7Phz4.jpg",
    "category": "yafindo"
  },
  { "price": 88200,
    "id": 198,
    "title": "TAMADA MARSMELLOW CONE STRAWBERRY 6X12X17G",
    "image": "/images/ixjieQgqYLCXljfbAwmc3pVEVe9EiIsLkteQvO3K.jpg",
    "category": "yafindo"
  },
  { "price": 88200,
    "id": 199,
    "title": "TAMADA MARSMELLOW CONE VANILA 6X12X17G",
    "image": "/images/UwzzCuKzoWTurSmIhzoIqiWWf4sqbeYuVK7Bloqq.jpg",
    "category": "yafindo"
  },
  { "price": 112896,
    "id": 200,
    "title": "TAMADA MARSMELLOW PIE COKLAT 12X24X4G",
    "image": "/images/8a142fd3ca4d37b1a6aac046b6a77c6f.png",
    "category": "yafindo"
  },
  { "price": 112896,
    "id": 201,
    "title": "TAMADA MARSMELLOW PIE STRAWBERRY 12X24X4G",
    "image": "/images/id-11134207-7r98r-lz0qr02x4izk8e.jpeg",
    "category": "yafindo"
  },
  { "price": 112896,
    "id": 202,
    "title": "TAMADA MARSMELLOW PIE VANILA 12X24X4G",
    "image": "/images/4941a3be19f2749714af1ace2ff7a173.png",
    "category": "yafindo"
  },
  { "price": 80000,
    "id": 203,
    "title": "TAMADA MEISESS 10X2X8GR",
    "image": "/images/YUdf30q7Xydud7PGZiO3riczB58X0i7oDV1j2N97.jpg",
    "category": "yafindo"
  },
  { "price": 154000,
    "id": 204,
    "title": "TP WAFER CHOCOLATE 14X300G",
    "image": "/images/tp.jpg",
    "category": "khong-guan"
  }
];

const generateAndInsert = async () => {
  const productsToInsert = data.map(product => ({
    productName: product.title,
    productImg: `https://cat-lac-nine.vercel.app${product.image}`,
    pricePerCarton: product.price,
    pricePerMiddle: 0,
    pricePerPcs: 0,
    category: product.category === 'khong-guan' ? 'kg' : product.category
  }));

  try {
    const { error } = await supabase
      .from('products')
      .insert(productsToInsert);

    if (error) throw error;

    Alert.alert(
      "Success",
      "Products have been successfully inserted into the database",
      [{ text: "OK" }]
    );

  } catch (error) {
    console.error('Error inserting products:', error);
    Alert.alert(
      "Error",
      "Failed to insert products into database. Please try again.",
      [{ text: "OK" }]
    );
  }
};

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.button,
          isLoading && styles.buttonDisabled
        ]}
        onPress={generateAndInsert}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Generating...' : 'Generate Products'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});