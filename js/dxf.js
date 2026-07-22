/* Bondi Trailer CAD — DXF exporter.
   Writes an AutoCAD 2000 (AC1015) ASCII DXF in MODEL SPACE MILLIMETRES
   ($INSUNITS = 4), which opens directly in AutoCAD, ZWCAD (中望CAD), ZW3D,
   DraftSight, LibreCAD, etc. Non-ASCII text (Chinese labels) is written as
   \U+XXXX escape sequences so the file itself stays pure ASCII and renders
   correctly regardless of the receiving system's codepage. Dimensions are
   exported as plain geometry (lines/solids/text) so nothing depends on the
   receiver's dimension-style setup. */
(function (root) {
  'use strict';
  const BFT = (root.BFT = root.BFT || {});

  function esc(s) {
    let out = '';
    for (const ch of String(s)) {
      const cp = ch.codePointAt(0);
      if (cp > 126) out += '\\U+' + cp.toString(16).toUpperCase().padStart(4, '0');
      else out += ch;
    }
    return out;
  }

  function dxfFromScene(scene, layersDef) {
    const L = [];                       // output lines
    const P = (code, val) => { L.push(String(code)); L.push(String(val)); };
    let handle = 0x30;
    const H = () => (++handle).toString(16).toUpperCase();
    const N = (v) => (Math.round(v * 1000) / 1000).toString();

    const layers = Object.keys(layersDef);

    // ---------- HEADER ----------
    P(0, 'SECTION'); P(2, 'HEADER');
    P(9, '$ACADVER'); P(1, 'AC1015');
    P(9, '$INSBASE'); P(10, 0); P(20, 0); P(30, 0);
    P(9, '$EXTMIN'); P(10, N(scene.bounds().minX)); P(20, N(scene.bounds().minY)); P(30, 0);
    P(9, '$EXTMAX'); P(10, N(scene.bounds().maxX)); P(20, N(scene.bounds().maxY)); P(30, 0);
    P(9, '$INSUNITS'); P(70, 4);        // 4 = millimetres
    P(9, '$MEASUREMENT'); P(70, 1);     // metric
    P(9, '$LTSCALE'); P(40, 1.0);
    P(9, '$HANDSEED'); P(5, 'FFFF');
    P(0, 'ENDSEC');

    // ---------- CLASSES ----------
    P(0, 'SECTION'); P(2, 'CLASSES'); P(0, 'ENDSEC');

    // ---------- TABLES ----------
    P(0, 'SECTION'); P(2, 'TABLES');

    // VPORT
    const vportTbl = H();
    P(0, 'TABLE'); P(2, 'VPORT'); P(5, vportTbl); P(330, 0); P(100, 'AcDbSymbolTable'); P(70, 1);
    P(0, 'VPORT'); P(5, H()); P(330, vportTbl); P(100, 'AcDbSymbolTableRecord'); P(100, 'AcDbViewportTableRecord');
    P(2, '*ACTIVE'); P(70, 0);
    P(10, 0); P(20, 0); P(11, 1); P(21, 1); P(12, 0); P(22, 0);
    P(13, 0); P(23, 0); P(14, 10); P(24, 10); P(15, 10); P(25, 10);
    P(16, 0); P(26, 0); P(36, 1); P(17, 0); P(27, 0); P(37, 0);
    P(40, 5000); P(41, 1.5); P(42, 50); P(43, 0); P(44, 0);
    P(50, 0); P(51, 0); P(71, 0); P(72, 100); P(73, 1); P(74, 3);
    P(75, 0); P(76, 0); P(77, 0); P(78, 0); P(281, 0); P(65, 1);
    P(110, 0); P(120, 0); P(130, 0); P(111, 1); P(121, 0); P(131, 0);
    P(112, 0); P(122, 1); P(132, 0); P(79, 0); P(146, 0);
    P(0, 'ENDTAB');

    // LTYPE
    const ltypeTbl = H();
    P(0, 'TABLE'); P(2, 'LTYPE'); P(5, ltypeTbl); P(330, 0); P(100, 'AcDbSymbolTable'); P(70, 4);
    const ltype = (name, desc, pattern) => {
      P(0, 'LTYPE'); P(5, H()); P(330, ltypeTbl); P(100, 'AcDbSymbolTableRecord'); P(100, 'AcDbLinetypeTableRecord');
      P(2, name); P(70, 0); P(3, desc); P(72, 65); P(73, pattern.length);
      P(40, N(pattern.reduce((a, b) => a + Math.abs(b), 0)));
      for (const seg of pattern) { P(49, N(seg)); P(74, 0); }
    };
    ltype('ByBlock', '', []); ltype('ByLayer', '', []); ltype('Continuous', 'Solid line', []);
    ltype('DASHED', 'Dashed __ __ __', [60, -40]);
    ltype('CENTER', 'Center ____ _ ____', [140, -40, 20, -40]);
    P(0, 'ENDTAB');

    // LAYER
    const layerTbl = H();
    P(0, 'TABLE'); P(2, 'LAYER'); P(5, layerTbl); P(330, 0); P(100, 'AcDbSymbolTable'); P(70, layers.length + 1);
    const layerRec = (name, color, lt) => {
      P(0, 'LAYER'); P(5, H()); P(330, layerTbl); P(100, 'AcDbSymbolTableRecord'); P(100, 'AcDbLayerTableRecord');
      P(2, name); P(70, 0); P(62, color); P(6, lt); P(370, -3); P(390, 'F');
    };
    layerRec('0', 7, 'Continuous');
    for (const name of layers) {
      const def = layersDef[name];
      const lt = def.dash ? (name === 'CENTER' ? 'CENTER' : 'DASHED') : 'Continuous';
      layerRec(name, def.dxf, lt);
    }
    P(0, 'ENDTAB');

    // STYLE
    const styleTbl = H();
    P(0, 'TABLE'); P(2, 'STYLE'); P(5, styleTbl); P(330, 0); P(100, 'AcDbSymbolTable'); P(70, 1);
    P(0, 'STYLE'); P(5, H()); P(330, styleTbl); P(100, 'AcDbSymbolTableRecord'); P(100, 'AcDbTextStyleTableRecord');
    P(2, 'Standard'); P(70, 0); P(40, 0); P(41, 1); P(50, 0); P(71, 0); P(42, 2.5); P(3, 'txt'); P(4, '');
    P(0, 'ENDTAB');

    // VIEW / UCS (empty)
    P(0, 'TABLE'); P(2, 'VIEW'); P(5, H()); P(330, 0); P(100, 'AcDbSymbolTable'); P(70, 0); P(0, 'ENDTAB');
    P(0, 'TABLE'); P(2, 'UCS'); P(5, H()); P(330, 0); P(100, 'AcDbSymbolTable'); P(70, 0); P(0, 'ENDTAB');

    // APPID
    const appidTbl = H();
    P(0, 'TABLE'); P(2, 'APPID'); P(5, appidTbl); P(330, 0); P(100, 'AcDbSymbolTable'); P(70, 1);
    P(0, 'APPID'); P(5, H()); P(330, appidTbl); P(100, 'AcDbSymbolTableRecord'); P(100, 'AcDbRegAppTableRecord');
    P(2, 'ACAD'); P(70, 0);
    P(0, 'ENDTAB');

    // DIMSTYLE
    const dimTbl = H();
    P(0, 'TABLE'); P(2, 'DIMSTYLE'); P(5, dimTbl); P(330, 0); P(100, 'AcDbSymbolTable'); P(70, 1); P(100, 'AcDbDimStyleTable');
    P(0, 'DIMSTYLE'); P(105, H()); P(330, dimTbl); P(100, 'AcDbSymbolTableRecord'); P(100, 'AcDbDimStyleTableRecord');
    P(2, 'Standard'); P(70, 0);
    P(0, 'ENDTAB');

    // BLOCK_RECORD
    const msHandle = '20', psHandle = '21';
    const blkTbl = H();
    P(0, 'TABLE'); P(2, 'BLOCK_RECORD'); P(5, blkTbl); P(330, 0); P(100, 'AcDbSymbolTable'); P(70, 2);
    P(0, 'BLOCK_RECORD'); P(5, msHandle); P(330, blkTbl); P(100, 'AcDbSymbolTableRecord'); P(100, 'AcDbBlockTableRecord'); P(2, '*Model_Space');
    P(0, 'BLOCK_RECORD'); P(5, psHandle); P(330, blkTbl); P(100, 'AcDbSymbolTableRecord'); P(100, 'AcDbBlockTableRecord'); P(2, '*Paper_Space');
    P(0, 'ENDTAB');
    P(0, 'ENDSEC');

    // ---------- BLOCKS ----------
    P(0, 'SECTION'); P(2, 'BLOCKS');
    const blockPair = (name, recHandle) => {
      P(0, 'BLOCK'); P(5, H()); P(330, recHandle); P(100, 'AcDbEntity'); P(8, '0');
      P(100, 'AcDbBlockBegin'); P(2, name); P(70, 0); P(10, 0); P(20, 0); P(30, 0); P(3, name); P(1, '');
      P(0, 'ENDBLK'); P(5, H()); P(330, recHandle); P(100, 'AcDbEntity'); P(8, '0'); P(100, 'AcDbBlockEnd');
    };
    blockPair('*Model_Space', msHandle);
    blockPair('*Paper_Space', psHandle);
    P(0, 'ENDSEC');

    // ---------- ENTITIES ----------
    P(0, 'SECTION'); P(2, 'ENTITIES');
    const entHead = (type) => {
      P(0, type); P(5, H()); P(330, msHandle); P(100, 'AcDbEntity');
    };
    for (const it of scene.items) {
      switch (it.k) {
        case 'line':
          entHead('LINE'); P(8, it.la); P(100, 'AcDbLine');
          P(10, N(it.x1)); P(20, N(it.y1)); P(30, 0);
          P(11, N(it.x2)); P(21, N(it.y2)); P(31, 0);
          break;
        case 'pline':
          entHead('LWPOLYLINE'); P(8, it.la); P(100, 'AcDbPolyline');
          P(90, it.pts.length); P(70, it.closed ? 1 : 0);
          for (const p of it.pts) { P(10, N(p[0])); P(20, N(p[1])); }
          break;
        case 'circle':
          entHead('CIRCLE'); P(8, it.la); P(100, 'AcDbCircle');
          P(10, N(it.cx)); P(20, N(it.cy)); P(30, 0); P(40, N(it.r));
          break;
        case 'arc':
          entHead('ARC'); P(8, it.la); P(100, 'AcDbCircle');
          P(10, N(it.cx)); P(20, N(it.cy)); P(30, 0); P(40, N(it.r));
          P(100, 'AcDbArc'); P(50, N(it.a1)); P(51, N(it.a2));
          break;
        case 'solid':
          entHead('SOLID'); P(8, it.la); P(100, 'AcDbTrace');
          P(10, N(it.pts[0][0])); P(20, N(it.pts[0][1])); P(30, 0);
          P(11, N(it.pts[1][0])); P(21, N(it.pts[1][1])); P(31, 0);
          P(12, N(it.pts[2][0])); P(22, N(it.pts[2][1])); P(32, 0);
          P(13, N(it.pts[2][0])); P(23, N(it.pts[2][1])); P(33, 0);
          break;
        case 'text': {
          entHead('TEXT'); P(8, it.la); P(100, 'AcDbText');
          P(10, N(it.x)); P(20, N(it.y)); P(30, 0);
          P(40, N(it.h)); P(1, esc(it.s));
          if (it.rot) P(50, N(it.rot));
          const hj = it.align === 'center' ? 1 : it.align === 'right' ? 2 : 0;
          if (hj) {
            P(72, hj);
            P(11, N(it.x)); P(21, N(it.y)); P(31, 0); // alignment point
          }
          P(100, 'AcDbText');
          break;
        }
      }
    }
    P(0, 'ENDSEC');

    // ---------- OBJECTS ----------
    P(0, 'SECTION'); P(2, 'OBJECTS');
    P(0, 'DICTIONARY'); P(5, 'C'); P(330, 0); P(100, 'AcDbDictionary'); P(281, 1);
    P(3, 'ACAD_GROUP'); P(350, 'D');
    P(0, 'DICTIONARY'); P(5, 'D'); P(330, 'C'); P(100, 'AcDbDictionary'); P(281, 1);
    P(0, 'ENDSEC');

    P(0, 'EOF');
    return L.join('\r\n') + '\r\n';
  }

  BFT.dxf = { dxfFromScene, esc };
})(typeof window !== 'undefined' ? window : globalThis);
if (typeof module !== 'undefined') module.exports = globalThis.BFT;

