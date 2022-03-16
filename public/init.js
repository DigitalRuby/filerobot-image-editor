/* eslint-disable import/no-named-as-default */
// eslint-disable-next-line import/no-named-as-default-member
import FilerobotImageEditor from '../packages/filerobot-image-editor/src';

function getElementById(id) {
  return document.getElementById(id);
}

const crop = getElementById('crop');
const finetune = getElementById('finetune');
const filter = getElementById('filter');
const filterLabel = getElementById('filter-label');
const watermark = getElementById('watermark');
const annotate = getElementById('annotate');
const annotateLabel = getElementById('annotate-label');
const resize = getElementById('resize');
const addImg = getElementById('add-image');
const modeOptions = getElementById('mode-options');
const jsTabTitle = getElementById('js-code-tab');
const jsCodeWrapper = getElementById('js-code-wrapper');
const reactTabTitle = getElementById('react-code-tab');
const reactCodeWrapper = getElementById('react-code-wrapper');
const cdnTabTitle = getElementById('cdn-code-tab');
const cdnCodeWrapper = getElementById('cdn-code-wrapper');
const copyButtons = document.querySelectorAll('.copy-button');
const accordions = document.querySelectorAll('[data-accordion]');

let useCloudimage = false;
const { TABS, TOOLS } = FilerobotImageEditor;

const EXAMPLE_CODE_TABS = {
  'js-code-tab': jsCodeWrapper,
  'react-code-tab': reactCodeWrapper,
  'cdn-code-tab': cdnCodeWrapper,
};

const DEFAULT_IMAGES_SRCS = [
  'https://scaleflex.cloudimg.io/v7/demo/river.png',
  'https://scaleflex.airstore.io/demo/spencer-davis-unsplash.jpg',
  'https://scaleflex.cloudimg.io/v7/demo/damian-markutt-unsplash.jpg',
];

const selectedTabs = [
  TABS.ADJUST,
  TABS.FINETUNE,
  TABS.FILTERS,
  TABS.WATERMARK,
  TABS.ANNOTATE,
  TABS.RESIZE,
];

const IMG_EDITOR_TABS = {
  adjust: TABS.ADJUST,
  finetune: TABS.FINETUNE,
  filter: TABS.FILTERS,
  watermark: TABS.WATERMARK,
  annotate: TABS.ANNOTATE,
  resize: TABS.RESIZE,
};

const pluginConfig = {
  source: 'https://scaleflex.cloudimg.io/v7/demo/river.png',
  tabsIds: selectedTabs,
  defaultTabId: TABS.RESIZE,
  defaultToolId: null,
  observePluginContainerSize: true,
  cloudimage: {
    token: 'demo',
    version: 'v7',
  },
  [TOOLS.TEXT]: { text: 'Filerobot...' },
  [TOOLS.WATERMARK]: {
    gallery: [
      'https://assets.scaleflex.com/Marketing/Logos/Scaleflex+Logos/PNG/SCALEFLEX+LOGO+-+Color+Dark+text.png?vh=45cac1',
      'https://assets.scaleflex.com/Marketing/Logos/Filerobot+Logos/Logo+with+Scaleflex/LOGOTYPE+WITH+SCALEFLEX-01-01.png?vh=76c5a7',
      'https://assets.scaleflex.com/Marketing/Logos/Filerobot+Logos/Logo+with+Scaleflex/LOGO+WITH+SCALEFLEX-01.png?vh=467711',
      'https://assets.scaleflex.com/Marketing/Logos/Filerobot+Logos/Logo+with+Scaleflex/LOGO+WITH+SCALEFLEX+ON+WHITE+BG.png?vh=7ae33c',
      'https://assets.scaleflex.com/Marketing/Logos/Filerobot+Logos/Logo+with+Scaleflex/LOGO+WITH+SCALEFLEX+ON+BLACK+BG.png?vh=619469',
      'https://assets.scaleflex.com/Marketing/Logos/Filerobot+Logos/Logo+Icon/FILEROBOT+ICON.png?vh=a4578e',
      'https://assets.scaleflex.com/Marketing/Logos/Filerobot+Logos/Logo+Icon/FILEROBOT+ICON+ON+WHITE+BG.png?vh=fa44f7',
      'https://assets.scaleflex.com/Marketing/Logos/Filerobot+Logos/Logo+Vertical/FILEROBOT+LOGO+VERTICAL.png?vh=05c4c3',
      'https://assets.scaleflex.com/Marketing/Logos/Scaleflex+Logos/PNG/SCALEFLEX+LOGO+-+Grayscale+Dark+text.png?vh=313898',
      'https://assets.scaleflex.com/Marketing/Logos/Scaleflex+Logos/Logo+Vertical/SCALEFLEX+LOGO+VERTICAL+WHITE+TEXT.png?vh=fca07b',
      'https://assets.scaleflex.com/Marketing/Logos/Scaleflex+Logos/Logo+Vertical/SCALEFLEX+LOGO+VERTICAL.PNG?vh=9a6fa1',
    ],
  },
};

function onSave(url, fileName) {
  let tmpLink = document.createElement('a');
  tmpLink.href = url;

  if (useCloudimage) {
    tmpLink.target = '_blank';
  } else {
    tmpLink.download = fileName;
  }

  tmpLink.style = 'position: absolute; z-index: -111; visibility: none;';
  document.body.appendChild(tmpLink);
  tmpLink.click();
  document.body.removeChild(tmpLink);
  tmpLink = null;
}

const filerobotImageEditor = new FilerobotImageEditor(
  document.querySelector('#editor_container'),
  pluginConfig,
);

filerobotImageEditor.render({
  onSave: (imageInfo) => {
    onSave(
      imageInfo[useCloudimage ? 'cloudimageUrl' : 'imageBase64'],
      imageInfo.fullName,
    );
  },
  useCloudimage,
});

function onChangeTabsHandler(event) {
  const { target } = event;
  const { value, checked } = target;
  const nextTab = IMG_EDITOR_TABS[value];

  if (checked) {
    if (!selectedTabs.includes(nextTab)) {
      selectedTabs.push(nextTab);
    }
  } else {
    const removedTabIndex = selectedTabs.indexOf(nextTab);

    if (selectedTabs.includes(nextTab) && selectedTabs.length === 1) {
      target.checked = true;
      return;
    }

    selectedTabs.splice(removedTabIndex, 1);
  }

  filerobotImageEditor.render({ tabsIds: [...selectedTabs] });
}

function toggleActiveImage(imageContainer, imageSrc) {
  const prevImageContainer = document.querySelector(
    '[data-image-editor-active-image]',
  );

  if (prevImageContainer) {
    prevImageContainer.removeAttribute('data-image-editor-active-image');
  }

  imageContainer.setAttribute('data-image-editor-active-image', '');

  filerobotImageEditor.render({ source: imageSrc });
}

function appendImageToContainer(imageSrc) {
  const imagesWrapper = document.querySelector('.uploaded-imgs-wrapper');
  const imageWrapper = document.createElement('div');

  imageWrapper.style.backgroundImage = `url(${imageSrc})`;

  imageWrapper.className = 'uploaded-img';

  imageWrapper.onclick = () => toggleActiveImage(imageWrapper, imageSrc);

  imagesWrapper.appendChild(imageWrapper);

  return imageWrapper;
}

function uploadImg(event) {
  const imageSrc = URL.createObjectURL(event.target.files[0]);

  const imageContainer = appendImageToContainer(imageSrc);

  toggleActiveImage(imageContainer, imageSrc);

  filerobotImageEditor.render({ source: imageSrc });
}

function changeModeHandler() {
  if (modeOptions.value === 'Cloudimage') {
    annotate.checked = false;
    annotate.disabled = true;
    annotateLabel.style.color = 'gray';
    annotateLabel.style.cursor = 'auto';

    filter.checked = false;
    filter.disabled = true;
    filterLabel.style.color = 'gray';
    filterLabel.style.cursor = 'auto';

    useCloudimage = true;
  } else {
    if (selectedTabs.includes(annotate.name)) {
      annotate.checked = true;
    }

    if (selectedTabs.includes(filter.name)) {
      filter.checked = true;
    }

    filter.disabled = false;
    filterLabel.style.color = '#203254';
    filterLabel.style.cursor = 'pointer';
    annotate.disabled = false;
    annotateLabel.style.color = '#203254';
    annotateLabel.style.cursor = 'pointer';

    useCloudimage = false;
  }

  filerobotImageEditor.render({ useCloudimage, tabsIds: [...selectedTabs] });
}

function changeCodeTabHandler(event) {
  const selectedCodeTabId = event.target.id;
  const selectedCode = EXAMPLE_CODE_TABS[selectedCodeTabId];

  Object.values(EXAMPLE_CODE_TABS).forEach((codeTab) => {
    // eslint-disable-next-line no-param-reassign
    codeTab.style.display = 'none';
  });

  selectedCode.style.display = 'unset';
}

function toggleActiveCodeTab(event) {
  const nextCodeTab = event.target || event;

  changeCodeTabHandler(event);

  const prevCodeTab = document.querySelector('[selected-tab]');

  if (prevCodeTab) {
    prevCodeTab.removeAttribute('selected-tab');
  }

  nextCodeTab.setAttribute('selected-tab', '');
}

document.onreadystatechange = () => {
  DEFAULT_IMAGES_SRCS.forEach((imageSrc, index) => {
    const imageContainer = appendImageToContainer(imageSrc);

    if (!index) {
      toggleActiveImage(imageContainer, imageSrc);
    }
  });
};

function copyCodeHandler(event) {
  const copyButton = event.currentTarget.getElementsByTagName('p')[0];
  const currentCodeTabId = document.querySelector('[selected-tab]').id;
  const currentCodeToCopy = EXAMPLE_CODE_TABS[currentCodeTabId];

  navigator.clipboard.writeText(currentCodeToCopy.innerText);

  if (copyButton.innerHTML === 'Copy') {
    copyButton.innerHTML = 'copied';

    setTimeout(() => {
      copyButton.innerHTML = 'Copy';
    }, 500);
  }
}

function showAccordionContent(event) {
  const contentId = event.target.getAttribute('data-accordion');
  const content = document.querySelector(
    `[data-accordion-content="${contentId}"]`,
  );

  content.style.display = !content?.offsetWidth ? 'block' : 'none';
}

crop.addEventListener('change', onChangeTabsHandler);
finetune.addEventListener('change', onChangeTabsHandler);
filter.addEventListener('change', onChangeTabsHandler);
watermark.addEventListener('change', onChangeTabsHandler);
annotate.addEventListener('change', onChangeTabsHandler);
resize.addEventListener('change', onChangeTabsHandler);
addImg.addEventListener('change', uploadImg);
modeOptions.addEventListener('change', changeModeHandler);
jsTabTitle.addEventListener('click', toggleActiveCodeTab);
reactTabTitle.addEventListener('click', toggleActiveCodeTab);
cdnTabTitle.addEventListener('click', toggleActiveCodeTab);
copyButtons.forEach((copyButton) => {
  copyButton.addEventListener('click', copyCodeHandler);
});
accordions.forEach((accordion) => {
  accordion.addEventListener('click', showAccordionContent);
});
