/* eslint-disable @next/next/no-head-element */
import * as React from 'react'

interface WorkspaceInvitationEmailProps {
  workspaceName: string
  inviterName: string
  inviterEmail: string
  recipientEmail: string
  role: string
  message?: string
  invitationUrl: string
  expiresInDays: number
}

export const WorkspaceInvitationEmail: React.FC<Readonly<WorkspaceInvitationEmailProps>> = ({
  workspaceName,
  inviterName,
  inviterEmail,
  recipientEmail,
  role,
  message,
  invitationUrl,
  expiresInDays,
}) => {
  const previewText = `${inviterName} invited you to join ${workspaceName} on Promption`

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>{previewText}</title>
      </head>
      <body style={{ 
        backgroundColor: '#f6f9fc', 
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
        margin: 0,
        padding: 0,
        lineHeight: '1.6',
        color: '#333333'
      }}>
        {/* Hidden preview text */}
        <div style={{ 
          display: 'none', 
          overflow: 'hidden', 
          lineHeight: '1px', 
          opacity: 0, 
          maxHeight: 0, 
          maxWidth: 0 
        }}>
          {previewText}
        </div>

        {/* Email wrapper */}
        <table role="presentation" style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          backgroundColor: '#f6f9fc',
          padding: '20px 0'
        }}>
          <tr>
            <td align="center">
              {/* Email container */}
              <table role="presentation" style={{ 
                maxWidth: '600px', 
                width: '100%', 
                borderCollapse: 'collapse',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}>
                {/* Header */}
                <tr>
                  <td style={{ 
                    backgroundColor: '#1f2937', 
                    padding: '40px 30px 30px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      backgroundColor: '#3b82f6',
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px'
                    }}>
                      <span style={{
                        color: '#ffffff',
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}>P</span>
                    </div>
                    <h1 style={{ 
                      color: '#ffffff', 
                      margin: '0 0 10px',
                      fontSize: '24px',
                      fontWeight: '600',
                      lineHeight: '1.3'
                    }}>
                      You&apos;re invited to join {workspaceName}
                    </h1>
                    <p style={{ 
                      color: '#d1d5db', 
                      margin: '0',
                      fontSize: '16px'
                    }}>
                      {inviterName} has invited you to collaborate on Promption
                    </p>
                  </td>
                </tr>

                {/* Body */}
                <tr>
                  <td style={{ padding: '40px 30px' }}>
                    <div style={{ marginBottom: '30px' }}>
                      <h2 style={{ 
                        margin: '0 0 20px',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>
                        Welcome to the team!
                      </h2>
                      <p style={{ 
                        margin: '0 0 20px',
                        fontSize: '16px',
                        color: '#4b5563',
                        lineHeight: '1.6'
                      }}>
                        <strong>{inviterName}</strong> ({inviterEmail}) has invited you to join the <strong>{workspaceName}</strong> workspace with <strong>{role.toLowerCase()}</strong> access.
                      </p>
                      
                      {message && (
                        <div style={{
                          backgroundColor: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          padding: '20px',
                          margin: '20px 0'
                        }}>
                          <p style={{
                            margin: '0',
                            fontSize: '14px',
                            color: '#6b7280',
                            fontStyle: 'italic'
                          }}>
                            &ldquo;{message}&rdquo;
                          </p>
                        </div>
                      )}

                      <div style={{
                        backgroundColor: '#fef3c7',
                        border: '1px solid #fcd34d',
                        borderRadius: '6px',
                        padding: '16px',
                        margin: '20px 0'
                      }}>
                        <p style={{
                          margin: '0',
                          fontSize: '14px',
                          color: '#92400e'
                        }}>
                          <strong>⏰ Time-sensitive:</strong> This invitation expires in {expiresInDays} days.
                        </p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div style={{ textAlign: 'center', margin: '30px 0' }}>
                      <a href={invitationUrl} style={{
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        textDecoration: 'none',
                        padding: '14px 28px',
                        borderRadius: '6px',
                        fontSize: '16px',
                        fontWeight: '600',
                        display: 'inline-block',
                        boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                      }}>
                        Accept Invitation
                      </a>
                    </div>

                    <p style={{ 
                      margin: '30px 0 0',
                      fontSize: '14px',
                      color: '#6b7280',
                      textAlign: 'center',
                      lineHeight: '1.5'
                    }}>
                      If the button doesn&apos;t work, you can also copy and paste this link into your browser:
                      <br />
                      <a href={invitationUrl} style={{ 
                        color: '#3b82f6', 
                        textDecoration: 'none',
                        wordBreak: 'break-all'
                      }}>
                        {invitationUrl}
                      </a>
                    </p>
                  </td>
                </tr>

                {/* Footer */}
                <tr>
                  <td style={{
                    backgroundColor: '#f9fafb',
                    padding: '30px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ 
                        margin: '0 0 10px',
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        This invitation was sent to <strong>{recipientEmail}</strong>
                      </p>
                      <p style={{ 
                        margin: '0',
                        fontSize: '12px',
                        color: '#9ca3af'
                      }}>
                        © 2024 Promption. All rights reserved.
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  )
} 