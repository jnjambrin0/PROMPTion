'use client'

import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { Checkbox } from '@/components/ui/checkbox'

interface LegalConsentProps {
  onMarketingChange: (checked: boolean) => void
}

export function LegalConsent({ onMarketingChange }: LegalConsentProps) {
  const { pending } = useFormStatus()

  return (
    <div className="space-y-4">
      {/* Legal Agreement Checkbox */}
      <div className="flex items-start space-x-3">
        <Checkbox
          id="termsAccepted"
          name="termsAccepted"
          disabled={pending}
          aria-describedby="terms-error"
          required
        />
        <div className="leading-none">
          <label
            htmlFor="termsAccepted"
            className="text-sm font-normal text-gray-600"
          >
            I have read and agree to the{' '}
            <Link
              href="/terms"
              className="font-medium text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="font-medium text-primary underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>
      </div>

      {/* Marketing Consent Checkbox */}
      <div className="flex items-start space-x-3">
        <Checkbox
          id="marketingConsent"
          name="marketingConsent"
          onCheckedChange={onMarketingChange}
          disabled={pending}
        />
        <div className="leading-none">
          <label
            htmlFor="marketingConsent"
            className="text-sm font-normal text-gray-600"
          >
            I would like to receive news and updates via email.
          </label>
        </div>
      </div>
    </div>
  )
} 