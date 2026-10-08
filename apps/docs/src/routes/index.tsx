import { Title } from '@solidjs/meta'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Label,
  Radio,
  Textarea,
} from '@solidcx/ui'

export default function Home() {
  return (
    <main class="docs-page">
      <section class="hero">
        <Badge>SolidCX UI</Badge>

        <h1>Build beautiful Solid apps.</h1>

        <p>
          A SolidJS component library built with Sass,
          semantic design tokens, and accessible native
          HTML primitives.
        </p>

        <div class="hero-actions">
          <Button>
            Get started
          </Button>

          <Button variant="outline">
            View components
          </Button>
        </div>
      </section>

      <section class="component-grid">
        <Card class="showcase-card">
          <h2>Form controls</h2>

          <div class="form-stack">
            <div class="form-field">
              <Label for="email">
                Email address
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div class="form-field">
              <Label for="message">
                Message
              </Label>

              <Textarea
                id="message"
                placeholder="Write something..."
              />
            </div>

            <Button>
              Submit
            </Button>
          </div>
        </Card>

        <Card class="showcase-card">
          <h2>Options</h2>

          <div class="option-stack">
            <label class="option">
              <Checkbox />
              <span>Receive notifications</span>
            </label>

            <label class="option">
              <Checkbox checked />
              <span>Enable dark mode</span>
            </label>

            <div class="radio-group">
              <Label>
                Plan
              </Label>

              <label class="option">
                <Radio
                  name="plan"
                  value="free"
                  checked
                />
                <span>Free</span>
              </label>

              <label class="option">
                <Radio
                  name="plan"
                  value="pro"
                />
                <span>Pro</span>
              </label>
            </div>
          </div>
        </Card>
      </section>
    </main>
  )
}