const cleanPhone = (phone) => String(phone || "").replace(/\D/g, "");

export const whatsappEmailService = {
  whatsappLink(phone, text = "") {
    const p = cleanPhone(phone);
    const body = encodeURIComponent(text || "");
    return p ? `https://wa.me/${p}?text=${body}` : "";
  },
  emailLink({ to = "", subject = "", body = "" } = {}) {
    const q = encodeURIComponent;
    return `mailto:${q(to)}?subject=${q(subject)}&body=${q(body)}`;
  },
  buildInvoiceShare(invoice, company = {}) {
    const text = `Hi, please find my invoice ${invoice.invoiceNo || ""} for ${Number(invoice.netAmount || 0).toFixed(2)} from ${company?.company?.name || "our store"}.`;
    return {
      whatsapp: this.whatsappLink(company?.company?.phone, text),
      email: this.emailLink({ to: company?.company?.email || "", subject: `Invoice ${invoice.invoiceNo || ""}`, body: text })
    };
  }
};
