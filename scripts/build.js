import Handlebars from 'handlebars'
import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

const layoutTemplateString = await fs.readFile('templates/partials/layout.handlebars', 'utf8')
const pageTemplateString = await fs.readFile('templates/partials/page.handlebars', 'utf8')
const sculpturePageTemplateString = await fs.readFile('templates/partials/sculpturePage.handlebars', 'utf8')
const aboutPageTemplateString = await fs.readFile('templates/partials/aboutPage.handlebars', 'utf8')
const contactPageTemplateString = await fs.readFile('templates/partials/contactPage.handlebars', 'utf8')
const homePageTemplateString = await fs.readFile('templates/partials/homePage.handlebars', 'utf8')

Handlebars.registerPartial('layout', layoutTemplateString)
Handlebars.registerPartial('page', pageTemplateString)

Handlebars.registerHelper('breaklines', (text) => {
    text = Handlebars.Utils.escapeExpression(text)
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>')
    return new Handlebars.SafeString(text)
});

async function copyFiles(srcFolder, destFolder) {
    const files = await fs.readdir(srcFolder)
    await fs.mkdir(destFolder, {recursive: true})

    for (const file of files) {
        const srcPath = path.join(srcFolder, file)
        const destPath = path.join(destFolder, file)
        await fs.copyFile(srcPath, destPath)
    }
}

async function cleanFolder(folderPath) {
    const entries = await fs.readdir(folderPath, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = path.join(folderPath, entry.name)

        if (entry.isDirectory()) {
            await fs.rm(fullPath, { recursive: true, force: true })
        } else {
            await fs.unlink(fullPath)
        }
    }
}

async function findPageDirectories(folderPath) {
    const pageDirectories = []
    const entries = await fs.readdir(folderPath, { withFileTypes: true })

    for (const entry of entries) {
        pageDirectories.push(path.join(folderPath, entry.name))
    }

    return pageDirectories
}

async function readPageData(pageFolderPath) {
    return JSON.parse(await fs.readFile(path.join(pageFolderPath, 'index.json'), 'utf8'))
}

async function findPageFactoryForPageType(data, pageFactoryTypeMap) {
    if (!pageFactoryTypeMap[data.type]) {
        throw new Error(`no factory type found for ${data.type}`)
    }

    return pageFactoryTypeMap[data.type]
}

/**
 * @param pageFolderPaths
 * @return {Promise<Record<string, {title: string, url: string}>>}
 */
async function createUrlTitleMapForPageFolderPaths(pageFolderPaths) {
    const map = {}

    for (const pageFolderPath of pageFolderPaths) {
        const data = await readPageData(pageFolderPath)

        map[data.url] = { title: data.title, url: data.url }
    }

    return map
}

/**
 *
 * @param {Record<string, {title: string, url: string}>} urlTitleMap
 * @param {string} activeUrl
 * @return {Promise<{name: string, url: string, isActive: boolean}[]>}
 */
async function createMenuItemsFromUrlTitleMap(urlTitleMap, activeUrl) {
    const menuItems = []

    for (const {title, url} of Object.values(urlTitleMap)) {
        menuItems.push({
            name: title,
            url: url,
            isActive: activeUrl === url,
        })
    }

    return menuItems
}

async function createSculpturePage(pageFolderPath, data, urlTitleMap) {
    const createSculpturePage = Handlebars.compile(sculpturePageTemplateString)

    const menuItems = await createMenuItemsFromUrlTitleMap(urlTitleMap, data.url)

    await fs.mkdir(`build/${data.url}`)

    await fs.mkdir(`build/${data.url}/images`)

    const images = []
    for (const imageUrl of data.imageUrls) {
        const imageBuffer = await fs.readFile(path.join(pageFolderPath, imageUrl))

        const imageBuildPath = path.join('build', data.url, imageUrl)

        const imagePath = path.parse(imageUrl)

        const imageThumbnailUrl = path.join(imagePath.dir, `${imagePath.name}_thumbnail.webp`)
            .replace('\\', '/')

        const imageThumbnailBuildPath = path.join('build', data.url, imageThumbnailUrl)

        await fs.writeFile(imageBuildPath, imageBuffer)

        const outputInfo = await sharp(imageBuffer)
            .resize({height: 50})
            .toFile(imageThumbnailBuildPath)

        images.push({
            url: imageUrl,
            thumbnail: {
                url: imageThumbnailUrl,
                height: outputInfo.height,
                width: outputInfo.width,
            }
        })

    }

    const result = createSculpturePage({
        url: data.url,
        title: data.title,
        previewImageUrl: data.previewImageUrl,
        description: data.description,
        menuItems,
        context: data.context,
        images
    })

    await fs.writeFile(`build/${data.url}/index.html`, result)
}

async function createAboutPage(pageFolderPath, data, urlTitleMap) {
    const createAboutPage = Handlebars.compile(aboutPageTemplateString)

    const menuItems = await createMenuItemsFromUrlTitleMap(urlTitleMap, data.url)

    await fs.mkdir(`build/${data.url}`)

    await fs.mkdir(`build/${data.url}/images`)

    await copyFiles(`data/pages/${data.url}/images`, `build/${data.url}/images`)

    const result = createAboutPage({
        url: data.url,
        title: data.title,
        previewImageUrl: data.previewImageUrl,
        description: data.description,
        menuItems,
        text: data.text,
        images: data.imageUrls,
    })

    await fs.writeFile(`build/${data.url}/index.html`, result)
}

async function createContactPage(pageFolderPath, data, urlTitleMap) {
    const createContactPage = Handlebars.compile(contactPageTemplateString)

    const menuItems = await createMenuItemsFromUrlTitleMap(urlTitleMap, data.url)

    await fs.mkdir(`build/${data.url}`)

    const result = createContactPage({
        url: data.url,
        title: data.title,
        previewImageUrl: data.previewImageUrl,
        description: data.description,
        menuItems,
        comments: data.comments,
    })

    await fs.writeFile(`build/${data.url}/index.html`, result)
}

async function createHomePage(pageFolderPath, data, urlTitleMap) {
    const createHomePage = Handlebars.compile(homePageTemplateString)

    const menuItems = await createMenuItemsFromUrlTitleMap(urlTitleMap, data.url)

    await fs.mkdir(`build/images`)

    await copyFiles(`data/pages/home/images`, `build/images`)

    const result = createHomePage({
        url: data.url,
        title: data.title,
        previewImageUrl: data.previewImageUrl,
        description: data.description,
        menuItems
    })

    await fs.writeFile(`build/index.html`, result)
}

const pageFactoryTypeMap = {
    sculpture: createSculpturePage,
    about: createAboutPage,
    contact: createContactPage,
    home: createHomePage
}

await fs.mkdir('build')

await cleanFolder('build')

await copyFiles('public', 'build')

const pageFolderPaths = await findPageDirectories('data/pages')

const urlTitleMap = await createUrlTitleMapForPageFolderPaths(pageFolderPaths)

for (const pageFolderPath of pageFolderPaths) {
    const pageData = await readPageData(pageFolderPath)

    const createPage = await findPageFactoryForPageType(pageData, pageFactoryTypeMap)

    await createPage(pageFolderPath, pageData, urlTitleMap)
}