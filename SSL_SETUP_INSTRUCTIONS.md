# 🔐 SSL Certificate & CloudFront Setup Guide (CORRECTED)

## Step 1: SSL Certificate - DNS Validation REQUIRED

**⚠️ ATTENTION: TWO records are required for validation.**

### **DNS Records to Add at Your Registrar**

| Type | Name / Host | Value / Points To |
|------|-------------|-------------------|
| **CNAME** | `_229a146ff911be7a5201675ad49a69dd` | `_e8a9b9867b1fe078a8810634de1d39ed.jkddzztszm.acm-validations.aws.` |
| **CNAME** | `_9808e20df37a63f32bedb57354d00658.www` | `_7626fe0ec24c32818231fa78eba3a3cb.jkddzztszm.acm-validations.aws.` |

---

## ⏱️ Timeline
1. Update these 2 records in Namecheap
2. Wait 5-10 minutes
3. Run `.\deploy-cloudfront.ps1`

**Deployment Status Monitoring is running in the background.**
Once these records are added, the certificate will automatically change to **ISSUED**.
