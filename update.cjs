const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

css = css.replace(/(\/\* Seamless bottom info bar[\s\S]*?pointer-events: none;\n})/, `/* Seamless bottom info bar - compact and aligned */
.project-info-bar {
  --s: calc(100vw / 1920);
  padding-bottom: calc(5 * var(--s));
  width: 100%;
  margin-top: 0px;
  color: var(--muted);
  background: none;
  font-size: calc(14 * var(--s));
  transition: transform 0.85s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.55s ease;
}
.project-info-bar .container {
  width: 100%;
  margin: 0;
  max-width: none;
}
.project-info-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: nowrap;
  gap: calc(24 * var(--s));
  padding: calc(10 * var(--s)) 0;
}
.project-info-col {
  min-width: calc(120 * var(--s));
  line-height: 1.4;
  font-size: calc(14 * var(--s));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: calc(12 * var(--s));
}
.project-info-desc {
  padding-top: calc(25 * var(--s));
  flex: 1 1 auto;
  max-width: calc(500 * var(--s));
  line-height: 1.4;
  font-size: calc(14 * var(--s));
  margin-left: calc(18 * var(--s));
  margin-right: calc(18 * var(--s));
  padding-bottom: calc(25 * var(--s));
}
.project-info-links {
  min-width: calc(70 * var(--s));
  text-align: right;
  line-height: 1.4;
  font-size: calc(14 * var(--s));
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: calc(20 * var(--s));
}

.project-info-center {
  top: calc(-20 * var(--s));
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-width: calc(80 * var(--s));
  gap: calc(6 * var(--s));
}
.project-info-center .project-info-range { order: -1; margin-top: 0; margin-bottom: calc(12 * var(--s)); letter-spacing: calc(2 * var(--s)); }
.project-info-center .explore-btn-text { order: 0; }
.project-info-center::before {
  content: "";
  position: absolute;
  top: calc(26 * var(--s));
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: calc(18 * var(--s));
  background: rgba(224, 229, 236, 0.35);
  pointer-events: none;
}
.project-info-center::after {
  content: "+";
  position: absolute;
  bottom: calc(-22 * var(--s));
  left: 50%;
  transform: translateX(-50%);
  color: var(--muted);
  font-size: calc(14 * var(--s));
  line-height: 1;
  pointer-events: none;
}
.project-info-flex .project-info-col:nth-of-type(3) {
  margin-left: calc(-100 * var(--s));
}
.project-info-flex .project-info-col:nth-of-type(2) b {
  display: inline-block;
  margin-right: calc(12 * var(--s));
}`);

css = css.replace(/(\.project-info-bar \.container \{[\s\S]*?margin-right: 12px; \/\* adjust gap to match reference \*\/\n\})/, '/* migrated to top */');

css = css.replace(/@media \(min-width: 1200px\) \{[\s\S]*?\.brand \{/, '@media (min-width: 1200px) {\n  .brand {');
css = css.replace(/@media \(min-width: 1600px\) \{[\s\S]*?\.brand \{/, '@media (min-width: 1600px) {\n  .brand {');

fs.writeFileSync('src/style.css', css);
console.log('done');
