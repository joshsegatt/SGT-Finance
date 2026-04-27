import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");
  
  // Clean up
  await prisma.transaction.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.bankAccount.deleteMany();
  await prisma.bankConnection.deleteMany();
  await prisma.invoiceLine.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.taxDeadline.deleteMany();
  await prisma.taxProfile.deleteMany();
  await prisma.entity.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  // Create roles (Assuming Roles are just an Enum and User has the role field)
  
  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Users
  const admin = await prisma.user.create({
    data: {
      name: "SGT Admin",
      email: "admin@sgt.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const viewer = await prisma.user.create({
    data: {
      name: "SGT Viewer",
      email: "viewer@sgt.com",
      password: hashedPassword,
      role: "VIEWER",
    },
  });

  // 2. Clients
  const clientAcme = await prisma.client.create({
    data: {
      name: "Acme Corp",
      contactName: "John Doe",
      email: "john@acmecorp.com",
      status: "ACTIVE",
    },
  });

  const clientGlobal = await prisma.client.create({
    data: {
      name: "Global Tech",
      contactName: "Jane Smith",
      email: "jane@globaltech.com",
      status: "ACTIVE",
    },
  });

  // 3. Entities
  const entityUK = await prisma.entity.create({
    data: {
      name: "SGT Holdings UK Ltd",
      type: "LTD",
      country: "UK",
      currency: "GBP",
      taxId: "GB123456789",
      scope: "BUSINESS",
    },
  });

  const entityPT = await prisma.entity.create({
    data: {
      name: "SGT Unipessoal Lda",
      type: "LDA",
      country: "Portugal",
      currency: "EUR",
      taxId: "PT987654321",
      scope: "BUSINESS",
    },
  });

  const entityDE = await prisma.entity.create({
    data: {
      name: "SGT Personal",
      type: "INDIVIDUAL",
      country: "Germany",
      currency: "EUR",
      scope: "PERSONAL",
    },
  });

  // 4. Tax Profiles & Deadlines
  const taxPT = await prisma.taxProfile.create({
    data: {
      entityId: entityPT.id,
      vatNumber: "PT987654321",
      corporateTaxRate: 21.0,
      vatRate: 23.0,
      taxRegime: "PT_IRC",
      provisionedAmount: 3200,
      deadlines: {
        create: [
          { title: "Monthly VAT Return", date: new Date("2026-05-20"), type: "VAT", status: "PENDING" },
          { title: "Corporate Tax Advance", date: new Date("2026-07-31"), type: "CORP", status: "PENDING" }
        ]
      }
    }
  });

  const taxUK = await prisma.taxProfile.create({
    data: {
      entityId: entityUK.id,
      vatNumber: "GB123456789",
      corporateTaxRate: 25.0,
      vatRate: 20.0,
      taxRegime: "UK_CORP",
      provisionedAmount: 5800,
      deadlines: {
        create: [
          { title: "Q1 VAT Return", date: new Date("2026-05-07"), type: "VAT", status: "PENDING" },
          { title: "PAYE Monthly", date: new Date("2026-05-22"), type: "PAYROLL", status: "PENDING" }
        ]
      }
    }
  });

  // 5. Bank Connections
  const connTrueLayer = await prisma.bankConnection.create({
    data: {
      provider: "TRUELAYER",
      institution: "Barclays UK",
      status: "ACTIVE",
      lastSync: new Date()
    }
  });

  const connTink = await prisma.bankConnection.create({
    data: {
      provider: "TINK",
      institution: "Santander ES",
      status: "ACTIVE",
      lastSync: new Date()
    }
  });

  const connMock = await prisma.bankConnection.create({
    data: {
      provider: "MOCK",
      institution: "Wise Multi-currency",
      status: "ACTIVE",
      lastSync: new Date()
    }
  });

  // 6. Bank Accounts
  const accountBarlays = await prisma.bankAccount.create({
    data: {
      entityId: entityUK.id,
      bankConnectionId: connTrueLayer.id,
      name: "Barclays Current Account",
      accountType: "CHECKING",
      currency: "GBP",
      balance: 45000.0,
      accountNumber: "****1234",
    }
  });

  const accountSantander = await prisma.bankAccount.create({
    data: {
      entityId: entityPT.id,
      bankConnectionId: connTink.id,
      name: "Santander Business EUR",
      accountType: "CHECKING",
      currency: "EUR",
      balance: 120000.0,
      accountNumber: "****5678",
    }
  });

  const accountWise = await prisma.bankAccount.create({
    data: {
      entityId: entityDE.id,
      bankConnectionId: connMock.id,
      name: "Wise USD Reserve",
      accountType: "SAVINGS",
      currency: "USD",
      balance: 12000.0,
      accountNumber: "****9012",
    }
  });

  // 7. Subscriptions
  const subAWS = await prisma.subscription.create({
    data: {
      name: "AWS Hosting", merchant: "Amazon Web Services", interval: "MONTHLY", amount: 1540.0, currency: "USD", status: "ACTIVE", nextBillingDate: new Date("2026-05-02")
    }
  });

  const subGoogle = await prisma.subscription.create({
    data: {
      name: "Google Workspace", merchant: "Google", interval: "MONTHLY", amount: 240.0, currency: "EUR", status: "ACTIVE", nextBillingDate: new Date("2026-05-05")
    }
  });

  const subZoomUnused = await prisma.subscription.create({
    data: {
      name: "Zoom Pro (Unused)", merchant: "Zoom", interval: "MONTHLY", amount: 14.99, currency: "USD", status: "AT_RISK", wasteDetected: true, nextBillingDate: new Date("2026-05-15")
    }
  });

  // 8. Transactions (Seeding last few months)
  const txs = [];
  const now = new Date("2026-04-24");
  
  for(let i=0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (i * 3));
    
    // Inflow
    txs.push({
      accountId: accountSantander.id,
      date: d,
      amount: 5000 + (Math.random() * 2000),
      currency: "EUR",
      description: `Client Payment IN ${i}`,
      category: "Income",
      status: "COMPLETED",
      taxRelevant: true
    });

    // Outflow
    txs.push({
      accountId: accountBarlays.id,
      date: d,
      amount: -1200 - (Math.random() * 500),
      currency: "GBP",
      description: `Supplier Payout OUT ${i}`,
      category: "Expense",
      status: "COMPLETED",
      taxRelevant: true
    });
  }

  // Subscription transactions
  txs.push({
    accountId: accountWise.id, date: new Date("2026-04-02"), amount: -1540.0, currency: "USD", description: "AWS Hosting", category: "Software", subscriptionId: subAWS.id, taxRelevant: true
  });
  txs.push({
    accountId: accountSantander.id, date: new Date("2026-04-05"), amount: -240.0, currency: "EUR", description: "Google Workspace", category: "Software", subscriptionId: subGoogle.id, taxRelevant: true
  });
  
  await prisma.transaction.createMany({ data: txs });

  // 9. Invoices
  await prisma.invoice.create({
    data: {
      entityId: entityUK.id,
      clientId: clientAcme.id,
      number: "INV-2026-001",
      date: new Date("2026-04-01"),
      dueDate: new Date("2026-05-01"),
      status: "DRAFT",
      currency: "GBP",
      lines: {
        create: [
          { description: "Development Hours March", quantity: 120, unitPrice: 150, amount: 18000, taxRate: 20 }
        ]
      }
    }
  });

  await prisma.invoice.create({
    data: {
      entityId: entityPT.id,
      clientId: clientGlobal.id,
      number: "INV-2026-002",
      date: new Date("2026-03-15"),
      dueDate: new Date("2026-04-15"),
      status: "OVERDUE",
      currency: "EUR",
      lines: {
        create: [
          { description: "Consulting Retainer", quantity: 1, unitPrice: 5000, amount: 5000, taxRate: 23 }
        ]
      }
    }
  });

  // 10. Alerts
  await prisma.alert.createMany({
    data: [
      { title: "Overdue Invoice", description: "Invoice INV-2026-002 to Global Tech is overdue by 9 days.", type: "WARNING" },
      { title: "Tax Deadline Approaching", description: "Q1 VAT Return for UK entity is due in 13 days.", type: "INFO" },
      { title: "Unused Subscription Detected", description: "Zoom Pro hasn't seen login activity. Consider cancelling.", type: "INFO" },
    ]
  });

  console.log("Seeding complete. Admin credentials: admin@sgt.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
