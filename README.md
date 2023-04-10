# get-labels-action
This Github action gets pr labels
1. Gets the list of labels on pr
- - if labels on PR are ["bug", "issue", "version:beta", "bump:patch"]
>>outputs labels > "bug,issue,version:beta,bump:patch"

2. Gets keyed label on pr
- - if specified label_key is `bump` and labels on PR are ["bug", "issue", "version:beta", "bump:patch"]
>>outputs label_value > "patch"

## Inputs

### `label_key`
The key used to get the label value, i.e `<label_key>:<label_value>`

example => "bump"

defaults to ''

### `default_label_value`
When no label with the label key is specified the default label_value to output

example => "patch"

defaults to ''

### `label_value_order`
Order of precedence for label_values, for example if the label_key is `bump` 

and multiple labels appear in the pr with key bump i.e `["bump:patch", "bump:minor", "bump:major"]`

and the label_value_order is `"patch,minor,major"` the patch value would take precedence and be outputted.

example => "patch,minor,major"

defaults to ''

### `github_token`
The token used to get labels for non pull_request events, i.e push events

not needed if labels are only needed for pull_request events

example => ${{ secrets.GITHUB_TOKEN }}

## Outputs

### `label_value`
The label value output. If key is bump and label is bump:patch the `label_value=patch`

### `labels`
The labels on the pr seperated by a comma. If labels are ["hello", "now", "new:now"] the labels="hello,now,new:now"

## Example usage

```yaml
- name: Get bump version
  id: bump_label
  uses: SamirMarin/get-labels-action@v0.0.1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    label_key: bump
    label_value_order: "patch,minor,major,ignore"
    default_label_value: patch

- name: Get tag prefix
  id: tag_prefix
  uses: SamirMarin/get-labels-action@v0.0.1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    label_key: version
    default_label_value: v
    
- name: Bump version and push tag
  id: tag_version
  uses: mathieudutour/github-tag-action@v6.1
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    default_bump: ${{ steps.bump_label.outputs.label_value }}
    dry_run: ${{ github.event_name == 'pull_request' }}
    tag_prefix: ${{ steps.tag_prefix.outputs.label_value }}
```