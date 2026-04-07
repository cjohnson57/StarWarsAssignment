USE [StarWarsAssignment]
GO

/****** Object:  Table [dbo].[Starships]    Script Date: 4/7/2026 2:24:14 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Starships](
	[StarshipId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](255) NULL,
	[Model] [nvarchar](255) NULL,
	[Manufacturer] [nvarchar](255) NULL,
	[CostInCredits] [bigint] NULL,
	[Length] [decimal](18, 2) NULL,
	[MaxAtmospheringSpeed] [int] NULL,
	[Crew] [int] NULL,
	[Passengers] [int] NULL,
	[CargoCapacity] [bigint] NULL,
	[Consumables] [nvarchar](255) NULL,
	[HyperdriveRating] [decimal](18, 2) NULL,
	[MGLT] [int] NULL,
	[StarshipClass] [nvarchar](255) NULL,
	[Created] [datetime] NULL,
	[Edited] [datetime] NULL,
 CONSTRAINT [PK__Starship__AA06F919024BB7A2] PRIMARY KEY CLUSTERED 
(
	[StarshipId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


