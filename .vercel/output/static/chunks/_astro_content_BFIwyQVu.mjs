import pLimit from 'p-limit';
import { A as AstroError, U as UnknownContentCollectionError, p as prependForwardSlash } from './astro/assets-service_BUXMbero.mjs';
import { a as createComponent, j as renderUniqueStylesheet, k as renderScriptElement, l as createHeadAndContent, b as renderTemplate, d as renderComponent, u as unescapeHTML } from './astro/server_o6jpNiAp.mjs';
import 'kleur/colors';

function createCollectionToGlobResultMap({
  globResult,
  contentDir
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1)
      continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
function createGetCollection({
  contentCollectionToEntryMap,
  dataCollectionToEntryMap,
  getRenderEntryImport,
  cacheEntriesByCollection
}) {
  return async function getCollection(collection, filter) {
    let type;
    if (collection in contentCollectionToEntryMap) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap) {
      type = "data";
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Ensure a collection directory with this name exists.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap[collection] : dataCollectionToEntryMap[collection]
    );
    let entries = [];
    if (!Object.assign({"BASE_URL": "/", "MODE": "production", "DEV": false, "PROD": true, "SSR": true, "SITE": "https://screwfast.uk", "ASSETS_PREFIX": undefined}, { _: process.env._ })?.DEV && cacheEntriesByCollection.has(collection)) {
      entries = cacheEntriesByCollection.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection.set(collection, entries);
    }
    if (typeof filter === "function") {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function")
    throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object")
    throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function")
      throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object")
      throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}

// astro-head-inject

const contentDir = '/src/content/';

const contentEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/en/post-1.md": () => import('./post-1_C-GBCZSh.mjs'),"/src/content/blog/en/post-2.md": () => import('./post-2_d4Nnci-1.mjs'),"/src/content/blog/en/post-3.md": () => import('./post-3_kO41Q-Cw.mjs'),"/src/content/blog/fr/post-1.md": () => import('./post-1_CF2n_YMD.mjs'),"/src/content/blog/fr/post-2.md": () => import('./post-2_BY-CjOCT.mjs'),"/src/content/blog/fr/post-3.md": () => import('./post-3_B04YK6zw.mjs'),"/src/content/docs/advanced/technical-specifications.mdx": () => import('./technical-specifications_BbOSg9vM.mjs'),"/src/content/docs/construction/custom-solutions.mdx": () => import('./custom-solutions_B8bLNa0C.mjs'),"/src/content/docs/construction/project-planning.mdx": () => import('./project-planning_BwxsvfhN.mjs'),"/src/content/docs/construction/safety.mdx": () => import('./safety_BsCu0anp.mjs'),"/src/content/docs/construction/service-overview.mdx": () => import('./service-overview_S4nciJor.mjs'),"/src/content/docs/de/guides/first-project-checklist.mdx": () => import('./first-project-checklist_7jryNlRn.mjs'),"/src/content/docs/de/guides/getting-started.mdx": () => import('./getting-started_Bu6wIUqB.mjs'),"/src/content/docs/de/guides/intro.mdx": () => import('./intro_CSthsmrH.mjs'),"/src/content/docs/de/welcome-to-docs.mdx": () => import('./welcome-to-docs_CApqIIkl.mjs'),"/src/content/docs/es/guides/first-project-checklist.mdx": () => import('./first-project-checklist_CEKnkI5t.mjs'),"/src/content/docs/es/guides/getting-started.mdx": () => import('./getting-started_mDcjB-4Q.mjs'),"/src/content/docs/es/guides/intro.mdx": () => import('./intro_J_YXpn2V.mjs'),"/src/content/docs/es/welcome-to-docs.mdx": () => import('./welcome-to-docs_btXFW0CN.mjs'),"/src/content/docs/fa/guides/first-project-checklist.mdx": () => import('./first-project-checklist_CRRIyMyI.mjs'),"/src/content/docs/fa/guides/getting-started.mdx": () => import('./getting-started_CSVY08sT.mjs'),"/src/content/docs/fa/guides/intro.mdx": () => import('./intro_BvkkG4bQ.mjs'),"/src/content/docs/fa/welcome-to-docs.mdx": () => import('./welcome-to-docs_yM-foObj.mjs'),"/src/content/docs/fr/guides/first-project-checklist.mdx": () => import('./first-project-checklist_SBmP28sX.mjs'),"/src/content/docs/fr/guides/getting-started.mdx": () => import('./getting-started_RZF768nX.mjs'),"/src/content/docs/fr/guides/intro.mdx": () => import('./intro_BPiw_mKH.mjs'),"/src/content/docs/fr/welcome-to-docs.mdx": () => import('./welcome-to-docs_BDmFq4Do.mjs'),"/src/content/docs/guides/first-project-checklist.mdx": () => import('./first-project-checklist_B6NAUxRZ.mjs'),"/src/content/docs/guides/getting-started.mdx": () => import('./getting-started_C79R0MIm.mjs'),"/src/content/docs/guides/intro.mdx": () => import('./intro_BRvgHFsp.mjs'),"/src/content/docs/ja/guides/first-project-checklist.mdx": () => import('./first-project-checklist_CZZsFwdv.mjs'),"/src/content/docs/ja/guides/getting-started.mdx": () => import('./getting-started_HG5LYjOd.mjs'),"/src/content/docs/ja/guides/intro.mdx": () => import('./intro_BWtHeiug.mjs'),"/src/content/docs/ja/welcome-to-docs.mdx": () => import('./welcome-to-docs_C4GVPs6n.mjs'),"/src/content/docs/tools/equipment-care.mdx": () => import('./equipment-care_C4T1bhg_.mjs'),"/src/content/docs/tools/tool-guides.mdx": () => import('./tool-guides_BygK-XqX.mjs'),"/src/content/docs/welcome-to-docs.mdx": () => import('./welcome-to-docs_ocgFjuhR.mjs'),"/src/content/docs/zh-cn/guides/first-project-checklist.mdx": () => import('./first-project-checklist_DskRIDmn.mjs'),"/src/content/docs/zh-cn/guides/getting-started.mdx": () => import('./getting-started_pq3vVma0.mjs'),"/src/content/docs/zh-cn/guides/intro.mdx": () => import('./intro_VgbUH3ec.mjs'),"/src/content/docs/zh-cn/welcome-to-docs.mdx": () => import('./welcome-to-docs_1xDZcrr3.mjs'),"/src/content/insights/insight-1.md": () => import('./insight-1_DTbb2wfQ.mjs'),"/src/content/insights/insight-2.md": () => import('./insight-2_BerjS5Rr.mjs'),"/src/content/insights/insight-3.md": () => import('./insight-3_DPJKvXrE.mjs'),"/src/content/products/a765.md": () => import('./a765_BGMaARMT.mjs'),"/src/content/products/b203.md": () => import('./b203_CWJqkp4o.mjs'),"/src/content/products/f303.md": () => import('./f303_BAXxt0cb.mjs'),"/src/content/products/t845.md": () => import('./t845_BEaWcbi5.mjs')});
const contentCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: contentEntryGlob,
	contentDir,
});

const dataEntryGlob = /* #__PURE__ */ Object.assign({});
const dataCollectionToEntryMap = createCollectionToGlobResultMap({
	globResult: dataEntryGlob,
	contentDir,
});
createCollectionToGlobResultMap({
	globResult: { ...contentEntryGlob, ...dataEntryGlob },
	contentDir,
});

let lookupMap = {};
lookupMap = {"docs":{"type":"content","entries":{"welcome-to-docs":"/src/content/docs/welcome-to-docs.mdx","construction/custom-solutions":"/src/content/docs/construction/custom-solutions.mdx","advanced/technical-specifications":"/src/content/docs/advanced/technical-specifications.mdx","construction/project-planning":"/src/content/docs/construction/project-planning.mdx","construction/safety":"/src/content/docs/construction/safety.mdx","construction/service-overview":"/src/content/docs/construction/service-overview.mdx","de/welcome-to-docs":"/src/content/docs/de/welcome-to-docs.mdx","es/welcome-to-docs":"/src/content/docs/es/welcome-to-docs.mdx","fa/welcome-to-docs":"/src/content/docs/fa/welcome-to-docs.mdx","fr/welcome-to-docs":"/src/content/docs/fr/welcome-to-docs.mdx","guides/first-project-checklist":"/src/content/docs/guides/first-project-checklist.mdx","guides/getting-started":"/src/content/docs/guides/getting-started.mdx","guides/intro":"/src/content/docs/guides/intro.mdx","ja/welcome-to-docs":"/src/content/docs/ja/welcome-to-docs.mdx","tools/equipment-care":"/src/content/docs/tools/equipment-care.mdx","tools/tool-guides":"/src/content/docs/tools/tool-guides.mdx","zh-cn/welcome-to-docs":"/src/content/docs/zh-cn/welcome-to-docs.mdx","de/guides/first-project-checklist":"/src/content/docs/de/guides/first-project-checklist.mdx","de/guides/getting-started":"/src/content/docs/de/guides/getting-started.mdx","de/guides/intro":"/src/content/docs/de/guides/intro.mdx","es/guides/first-project-checklist":"/src/content/docs/es/guides/first-project-checklist.mdx","es/guides/getting-started":"/src/content/docs/es/guides/getting-started.mdx","es/guides/intro":"/src/content/docs/es/guides/intro.mdx","fa/guides/first-project-checklist":"/src/content/docs/fa/guides/first-project-checklist.mdx","fa/guides/getting-started":"/src/content/docs/fa/guides/getting-started.mdx","fa/guides/intro":"/src/content/docs/fa/guides/intro.mdx","fr/guides/first-project-checklist":"/src/content/docs/fr/guides/first-project-checklist.mdx","fr/guides/getting-started":"/src/content/docs/fr/guides/getting-started.mdx","fr/guides/intro":"/src/content/docs/fr/guides/intro.mdx","ja/guides/first-project-checklist":"/src/content/docs/ja/guides/first-project-checklist.mdx","ja/guides/getting-started":"/src/content/docs/ja/guides/getting-started.mdx","ja/guides/intro":"/src/content/docs/ja/guides/intro.mdx","zh-cn/guides/first-project-checklist":"/src/content/docs/zh-cn/guides/first-project-checklist.mdx","zh-cn/guides/getting-started":"/src/content/docs/zh-cn/guides/getting-started.mdx","zh-cn/guides/intro":"/src/content/docs/zh-cn/guides/intro.mdx"}},"insights":{"type":"content","entries":{"insight-1":"/src/content/insights/insight-1.md","insight-2":"/src/content/insights/insight-2.md","insight-3":"/src/content/insights/insight-3.md"}},"products":{"type":"content","entries":{"a765":"/src/content/products/a765.md","b203":"/src/content/products/b203.md","f303":"/src/content/products/f303.md","t845":"/src/content/products/t845.md"}},"blog":{"type":"content","entries":{"en/post-1":"/src/content/blog/en/post-1.md","en/post-2":"/src/content/blog/en/post-2.md","en/post-3":"/src/content/blog/en/post-3.md","fr/post-1":"/src/content/blog/fr/post-1.md","fr/post-2":"/src/content/blog/fr/post-2.md","fr/post-3":"/src/content/blog/fr/post-3.md"}}};

function createGlobLookup(glob) {
	return async (collection, lookupId) => {
		const filePath = lookupMap[collection]?.entries[lookupId];

		if (!filePath) return undefined;
		return glob[collection][filePath];
	};
}

const renderEntryGlob = /* #__PURE__ */ Object.assign({"/src/content/blog/en/post-1.md": () => import('./post-1_BhkeIrTN.mjs'),"/src/content/blog/en/post-2.md": () => import('./post-2_D0efxXFm.mjs'),"/src/content/blog/en/post-3.md": () => import('./post-3_Dv3eBMZz.mjs'),"/src/content/blog/fr/post-1.md": () => import('./post-1__hqdfhwC.mjs'),"/src/content/blog/fr/post-2.md": () => import('./post-2_9trO4RRt.mjs'),"/src/content/blog/fr/post-3.md": () => import('./post-3_DVEMQowl.mjs'),"/src/content/docs/advanced/technical-specifications.mdx": () => import('./technical-specifications_BcNa2dAF.mjs'),"/src/content/docs/construction/custom-solutions.mdx": () => import('./custom-solutions_ySaf_9A5.mjs'),"/src/content/docs/construction/project-planning.mdx": () => import('./project-planning_jxvmw9c5.mjs'),"/src/content/docs/construction/safety.mdx": () => import('./safety_26KfUFHe.mjs'),"/src/content/docs/construction/service-overview.mdx": () => import('./service-overview_ByO3YzfB.mjs'),"/src/content/docs/de/guides/first-project-checklist.mdx": () => import('./first-project-checklist_ath1VFfF.mjs'),"/src/content/docs/de/guides/getting-started.mdx": () => import('./getting-started_DgAkqUNo.mjs'),"/src/content/docs/de/guides/intro.mdx": () => import('./intro_DJj4RTcp.mjs'),"/src/content/docs/de/welcome-to-docs.mdx": () => import('./welcome-to-docs_BhTTBbc1.mjs'),"/src/content/docs/es/guides/first-project-checklist.mdx": () => import('./first-project-checklist_Cc9Xow60.mjs'),"/src/content/docs/es/guides/getting-started.mdx": () => import('./getting-started_BrvTIL3p.mjs'),"/src/content/docs/es/guides/intro.mdx": () => import('./intro_CQFlKcK7.mjs'),"/src/content/docs/es/welcome-to-docs.mdx": () => import('./welcome-to-docs_B4n7sI4f.mjs'),"/src/content/docs/fa/guides/first-project-checklist.mdx": () => import('./first-project-checklist_C0vNY_ni.mjs'),"/src/content/docs/fa/guides/getting-started.mdx": () => import('./getting-started__3t0BnVU.mjs'),"/src/content/docs/fa/guides/intro.mdx": () => import('./intro_oSax9MQ9.mjs'),"/src/content/docs/fa/welcome-to-docs.mdx": () => import('./welcome-to-docs_BK2kQQ6p.mjs'),"/src/content/docs/fr/guides/first-project-checklist.mdx": () => import('./first-project-checklist_BTLzVhHe.mjs'),"/src/content/docs/fr/guides/getting-started.mdx": () => import('./getting-started_DaRPo3mt.mjs'),"/src/content/docs/fr/guides/intro.mdx": () => import('./intro_CvHRyfOM.mjs'),"/src/content/docs/fr/welcome-to-docs.mdx": () => import('./welcome-to-docs_DtxNHBem.mjs'),"/src/content/docs/guides/first-project-checklist.mdx": () => import('./first-project-checklist_BzXBvDO7.mjs'),"/src/content/docs/guides/getting-started.mdx": () => import('./getting-started_BkI5Y8We.mjs'),"/src/content/docs/guides/intro.mdx": () => import('./intro_CKTv8uRx.mjs'),"/src/content/docs/ja/guides/first-project-checklist.mdx": () => import('./first-project-checklist_CwT7p6vV.mjs'),"/src/content/docs/ja/guides/getting-started.mdx": () => import('./getting-started_CQHvkNYV.mjs'),"/src/content/docs/ja/guides/intro.mdx": () => import('./intro_D5c5e2es.mjs'),"/src/content/docs/ja/welcome-to-docs.mdx": () => import('./welcome-to-docs_YyyhXg9v.mjs'),"/src/content/docs/tools/equipment-care.mdx": () => import('./equipment-care_Ca23zBSh.mjs'),"/src/content/docs/tools/tool-guides.mdx": () => import('./tool-guides_Oo-G6BF1.mjs'),"/src/content/docs/welcome-to-docs.mdx": () => import('./welcome-to-docs_-1SzLmZt.mjs'),"/src/content/docs/zh-cn/guides/first-project-checklist.mdx": () => import('./first-project-checklist_BtYICS6s.mjs'),"/src/content/docs/zh-cn/guides/getting-started.mdx": () => import('./getting-started_DExQe_IK.mjs'),"/src/content/docs/zh-cn/guides/intro.mdx": () => import('./intro_kf492UXm.mjs'),"/src/content/docs/zh-cn/welcome-to-docs.mdx": () => import('./welcome-to-docs_p2OTpFZ7.mjs'),"/src/content/insights/insight-1.md": () => import('./insight-1_BgoigzDL.mjs'),"/src/content/insights/insight-2.md": () => import('./insight-2_D3rlMzZJ.mjs'),"/src/content/insights/insight-3.md": () => import('./insight-3_At1lmLVR.mjs'),"/src/content/products/a765.md": () => import('./a765_i78MtCef.mjs'),"/src/content/products/b203.md": () => import('./b203_DMKPwWBA.mjs'),"/src/content/products/f303.md": () => import('./f303_C0xwZJcK.mjs'),"/src/content/products/t845.md": () => import('./t845_DET6RRUL.mjs')});
const collectionToRenderEntryMap = createCollectionToGlobResultMap({
	globResult: renderEntryGlob,
	contentDir,
});

const cacheEntriesByCollection = new Map();
const getCollection = createGetCollection({
	contentCollectionToEntryMap,
	dataCollectionToEntryMap,
	getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
	cacheEntriesByCollection,
});

export { getCollection as g };
