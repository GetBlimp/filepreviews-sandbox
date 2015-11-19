import transformObject from 'lib/transformObject'

export const getJSCodeSample = (key, secret, url, options = {}) => (
`import FilePreviews from 'filepreviews'

const fp = new FilePreviews({
  debug: true,
  apiKey: '${key}',
  apiSecret: '${secret}'
})

const options = ${transformObject(options, 'node')}

fp.generate('${url}', options (err, result) => {
  if (err) throw new Error(err)
  console.log(result)
})`
)

export const getPythonCodeSample = (key, secret, url, options = {}) => (
`from filepreviews import FilePreviews

fp = FilePreviews(api_key='${key}', api_secret='${secret}')
options = ${transformObject(options, 'python')}

fp.generate('${url}', **options)`
)

export const getRubyCodeSample = (key, secret, url, options = {}) => (
`require 'filepreviews'

conf = {options: ${transformObject(options, 'ruby')}}

Filepreviews.api_key = '${key}'
Filepreviews.config.secret_key = '${secret}'
result = Filepreviews.generate('${url}', conf)`
)

export const getGoCodeSample = (key, secret, url, options = {}) => (
`fp := filepreviews.New("${key}", "${secret}")

opts := &filepreviews.Options{
${transformObject(options, 'go')}
}

_, err := fp.Generate("${url}", opts)`
)

export const getElixirCodeSample = (key, secret, url, options = {}) => (
`{:ok, filepreviews} = FilePreviews.new("${key}", "${secret}")
params = ${transformObject(options, 'elixir')}
{status, response} = FilePreviews.generate("${url}", params)`
)

export const getPHPCodeSample = (key, secret, url, options = {}) => (
`$fp = new FilePreviews\FilePreviews([
  'api_key' => '${key}',
  'api_secret' => '${secret}'
]);

$options = ${transformObject(options, 'php')};

$response = $fp->generate($url);
print_r($response);
`
)
